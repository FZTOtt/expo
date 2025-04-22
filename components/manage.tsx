import { View, TouchableOpacity, StyleSheet, Image, Text, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import { Audio } from 'expo-av';
import { getRandomWord, getWord, translateAudio, writeStat } from '@/api/api';
import MicOn from '@/assets/icons/micon.svg';
import MicOff from '@/assets/icons/micoff.svg';
import NextWord from '@/assets/icons/next_word.svg';
import { setTranslatedAudio, setTargetWord, setTargetAudioUrl, setSendStat, setReloadTargetWord, setTopicStatistic } from '@redux/translated';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { RootState } from '@/redux/store';
import TargetWord from '@/interfaces/targetWord';
import AudioRecorder from './aidoRecorder';
import playOwnActive from '@/assets/images/play_own_active.jpg';
import playOwnPassive from '@/assets/images/play_own_passive.jpg';

const Manage = () => {

    const dispatch = useAppDispatch();
    const { targetWord, reloadWord, tags, usersRecord, completedWords, totalWords } = useAppSelector((state: RootState) => state.translated);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    async function playRecording() {
        try {
            if (usersRecord) {
                if (sound) {
                    await sound.unloadAsync();
                }
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: usersRecord || '' }
                );
                setSound(newSound);
                await newSound.playAsync();
            }
        } catch (err) {
            console.error('Ошибка воспроизведения аудио', err);
        }
    }

    const fetchRandomWord = async (tags: string = "", random: boolean = true) => {
        let status, response
        if (random) {
            [status, response] = await getRandomWord(tags);
        } else {
            [status, response] = await getWord(tags);
        }
        
        if (status === 200) {
            let url = response.audio_link;
            url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
            url = url.replace(/&/g, '\\u0026');
            const targetWord: TargetWord = {
                'targetWord': response.word,
                'targetTranscription': response.transcription,
                'wordId': response.id
            }
            dispatch(setTargetWord(targetWord));
            dispatch(setTargetAudioUrl(url));
            if (!random) {
                dispatch(setTopicStatistic({
                    // complitedWords: response.true_words,
                    // totalWords: response.all_words
                    complitedWords: 5,
                    totalWords: 10
                }))
            }
        } else {
            console.error('Ошибка в запросе fetchRandomWord', response);
        }
    }

    const handleRecordingComplete = async (audio: Blob | string) => {
        const [status, response] = await translateAudio(audio);
        if (status === 200) {
            dispatch(setTranslatedAudio(response.transcription));
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
    }

    // useEffect(() => {
    //     if (!targetWord) {
    //         fetchRandomWord(tags)
    //     }
    // }, [tags])

    useEffect(() => {
        console.log('MOUNTED Component');
        return () => console.log('UNMOUNTED Component');
      }, []);

    useEffect(() => {
        if (reloadWord) {
            fetchRandomWord(reloadWord, false)
        } else {
            fetchRandomWord(tags)
        }
    }, [reloadWord, tags])

    function handleNextWord() {
        fetchRandomWord(tags)
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={playRecording}>
                    <Image source={ usersRecord ? playOwnActive : playOwnPassive} style={styles.icon} />
                </TouchableOpacity>
                
                <AudioRecorder onState={MicOn} offState={MicOff} size={90} onRecordComplete={handleRecordingComplete}></AudioRecorder>
                
                <TouchableOpacity style={[styles.button, styles.disabledButton]} onPress={handleNextWord}>
                    <NextWord width={90} height={90}/>
                </TouchableOpacity>

                
            </View >
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