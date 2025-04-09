import { View, TouchableOpacity, StyleSheet, Image, Text, Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Audio } from 'expo-av';
import { AndroidAudioEncoder, AndroidOutputFormat, IOSOutputFormat } from 'expo-av/build/Audio';
import { getRandomWord, getWord, translateAudio, writeStat } from '@/api/api';
import MicOn from '@/assets/icons/micon.svg';
import MicOff from '@/assets/icons/micoff.svg';
import NextWord from '@/assets/icons/next_word.svg';
import { setTranslatedAudio, setTargetWord, setTargetAudioUrl, setSendStat } from '@redux/translated';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { RootState } from '@/redux/store';
import TargetWord from '@/interfaces/targetWord';

const Manage = () => {

    const dispatch = useAppDispatch();
    const { translatedAudio, isCorrect, targetWord, reloadWord, tags, wordId } = useAppSelector((state: RootState) => state.translated);


    const [recording, setRecording] = useState<Audio.Recording | undefined>();
    const [isRecording, setIsRecording] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();


    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    async function startRecording() {
        if (Platform.OS === 'web') {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setRecordingUri(audioUrl);

                    const [status, response] = await translateAudio(audioBlob);
                    if (status === 200) {
                        dispatch(setTranslatedAudio(response.payload.transcription));
                    } else {
                        dispatch(setTranslatedAudio('hello1'))
                    }
                    
                    audioChunksRef.current = [];
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (error) {
                console.error("Ошибка доступа к микрофону:", error);
            }
        } else {
            try {
                if (permissionResponse?.status !== 'granted') {
                    console.log('Requesting permission..');
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync({
                isMeteringEnabled: true,
                android: {
                ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
                extension: '.wav',
                outputFormat: AndroidOutputFormat.DEFAULT,
                audioEncoder: AndroidAudioEncoder.DEFAULT,
                },
                ios: {
                ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
                extension: '.wav',
                outputFormat: IOSOutputFormat.LINEARPCM,
                },
                web: {
                mimeType: 'audio/wav',
                bitsPerSecond: 128000,
                },
            });   
            setRecording(recording);
            setIsRecording(true);
            console.log('Recording started');
            } catch (err) {
                console.error('Failed to start recording', err);
            }
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        if (Platform.OS === 'web') {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
                setIsRecording(false);
            }
        } else {
            if (!recording) return;
                
            try {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setIsRecording(false);
                if (uri)
                {
                    try {
                        const formData = new FormData();
                        formData.append('file', { uri: uri, name: 'audio.wav', type: 'audio/wav' } as any);
                        //https://ouzistudy.ru/api/audio/translate_audio
                        // https://httpbin.org/anything
                        const response = await fetch('https://ouzistudy.ru/api/audio/translate_audio', {
                            method: 'POST',
                            body: formData,
                            mode: "cors",
                            credentials: "include",
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        const answer = await response.json();
                        console.log('answer', answer)
                        if (response.status === 200) {
                            dispatch(setTranslatedAudio(answer.payload.transcription));
                        }

                    } catch (err) {
                        console.error('Failed to send audio', err);
                    }
                }
                
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                });
                setRecording(undefined);
                setRecordingUri(uri);
                console.log('success');
        } catch (err) {
                console.error('Failed to stop recording', err);
            }
        }
    }

    async function playRecording() {
        try {
            if (recordingUri) {
                if (sound) {
                    await sound.unloadAsync();
                }
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: recordingUri }
                );
                setSound(newSound);
                await newSound.playAsync();
            }
        } catch (err) {
            console.error('Failed to play recording', err);
        }
    }

    const fetchRandomWord = async (tags: string = "", random: boolean = true) => {
        console.log('random', random)
        let status, response
        if (random) {
            [status, response] = await getRandomWord(tags);
        } else {
            [status, response] = await getWord(tags);
        }
        
        console.log(status, response)

        if (status === 200) {
            let url = response.link;
            url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
            url = url.replace(/&/g, '\\u0026');
            const targetWord: TargetWord = {
                'targetWord': response.word,
                'targetTranscription': response.transcription,
                'wordId': response.word_id
            }
            console.log(targetWord)
            dispatch(setTargetWord(targetWord));
            console.log('url', url)
            dispatch(setTargetAudioUrl(url));
        } else {
            console.error('Ошибка в запросе fetchRandomWord', response);
        }
    }

    useEffect(() => {
        if (!targetWord) {
            fetchRandomWord(tags)
        }
    }, [targetWord])

    useEffect(() => {
        if (reloadWord) {
            fetchRandomWord(reloadWord, false)
        }
    }, [reloadWord])

    useEffect(() => {
        const writeStatistics = async (data: {"id": number, "plus": number, "minus": number}) => {
            try {
                const [status, response] = await writeStat(data)
                console.log(status, response)
            } catch (error) {
                console.log('write statistic error', error)
            }
            
        }

        if (isCorrect !== null) {

            const data = {
                "id": wordId,
                "plus": isCorrect ? 1 : 0,
                "minus": isCorrect ? 0 : 1
            }
            writeStatistics(data)
            dispatch(setSendStat())
        }
    }, [isCorrect])

    function handleNextWord() {
        fetchRandomWord(tags)
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={playRecording}>
                    <Image source={ recordingUri ? require('../assets/icons/play_own_active.jpg') : require('../assets/icons/play_own_passive.jpg')} style={styles.icon} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.buttonLarge}
                    onPress={isRecording ? stopRecording : startRecording}
                >
                    {isRecording ? <MicOff width={90} height={90}/> : <MicOn width={90} height={90}/>}
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.button, styles.disabledButton]} onPress={handleNextWord}>
                    <NextWord width={90} height={90}/>
                </TouchableOpacity>

                
            </View >
            
            <View style={styles.textContainer}>
                {translatedAudio ? 
                    <Text style={styles.recognizedText}>Распознано {translatedAudio}</Text>
                    :
                    <Text style={styles.recognizedText}>{isRecording ? 'Нажмите для остановки записи':'Нажмите для записи'}</Text>
                    }
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
    },
    recognizedText: {
        marginTop: 20,
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
    },
    textContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonLarge: {
      width: 90,
      height: 90,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    disabledButton: {
      opacity: 0.5,
    },
    icon: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    iconLarge: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});

export default Manage;