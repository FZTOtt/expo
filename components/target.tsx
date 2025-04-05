import { getWord } from '@/api/api';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setTargetWord } from '@/redux/translated';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';

const Target = () => {
    const dispatch = useAppDispatch();
    const { targetWord, isCorrect, targetAudioUrl, targetTranscription } = useAppSelector((state: RootState) => state.translated);

    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const [wordHeight, setWordHeight] = useState(0);

    // useEffect(() => {
    //     const fetchWord = async () => {
    //         console.log('fetchWord')
    //         try {
    //             const response = await fetch('https://ouzistudy.ru/api/word/get_word/hello')
    //             // const ans = await response.formData()
    //             // dispatch(setTargetWord(ans.get('word') as string));
                
    //         } catch (err) {
    //             console.error('Failed to fetch word', err);
    //         }
    //         console.log('end fetch')
    //     }
    //     // fetchWord()

    //     const loadAudio = async () => {
    //         const audioUrl = 'http://178.57.244.113:5000/audio';

    //         const { sound } = await Audio.Sound.createAsync(
    //             { uri: audioUrl }
    //         );

    //         setSound(sound);
    //     };

    //     // loadAudio();

    //     return () => {
    //         if (sound) {
    //             sound.unloadAsync();
    //         }
    //     };

    //     // const togglePlayback = async () => {
    //     //     if (sound) {
    //     //         if (isPlaying) {
    //     //             await sound.stopAsync();
    //     //         } else {
    //     //             await sound.playAsync();
    //     //         }
    //     //         setIsPlaying(!isPlaying);
    //     //     }
    //     // };
    // }, [])

    async function playRecording() {
        try {
            if (targetAudioUrl) {
                if (sound) {
                    await sound.unloadAsync();
                }
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: targetAudioUrl }
                );
                setSound(newSound);
                await newSound.playAsync();
                }
        } catch (err) {
            console.error('Failed to play recording', err);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.wordContainer}>
                <Text style={[styles.word, isCorrect === null ? {} : isCorrect ? styles.wordCorrect : styles.wordIncorrect]}>
                    {targetWord ? targetWord.charAt(0).toUpperCase() + targetWord.slice(1) : ''}
                </Text>
                <TouchableOpacity style={styles.audioButton} onPress={playRecording}>
                    <Image 
                        source={require('../assets/icons/play_target_audio.jpg')} 
                        style={styles.playButton}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.transcription}>
                {targetTranscription}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wordContainer: {
        height: 60,
    },
    word: {
        fontSize: 60,
        lineHeight: 60,
    },
    wordCorrect: {
        color: 'green',
    },
    wordIncorrect: {
        color: 'red',
    },
    audioButton: {
        position: 'absolute',
        height: 60,
        right: -40,
        justifyContent: 'center',
    },
    playButton: {
        width: 30,
        height: 30,
    },
    transcription: {
        fontSize: 20,
        marginTop: 10,
    }
});



export default Target;