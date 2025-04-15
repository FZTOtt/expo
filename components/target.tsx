import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/hooks/useAppSelector';
import Regerence from '@/assets/icons/reference.svg';
import { useAppDispatch } from '@/hooks';
import { setVisible } from '@/redux/modal';
import AudioPlayer from './audioPlayer';

const Target = () => {
    const { targetWord, isCorrect, targetAudioUrl, targetTranscription } = useAppSelector((state: RootState) => state.translated);
    const { isVisible } = useAppSelector((state: RootState) => state.modal);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const dispatch = useAppDispatch();

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

    function openReference() {
        dispatch(setVisible(!isVisible))
    }

    return (
        <View style={styles.container}>
            <View style={styles.wordContainer}>
                <TouchableOpacity style={styles.referenceButton} onPress={openReference}>
                    <Regerence width={30} height={30}></Regerence>
                </TouchableOpacity>
                <Text style={[styles.word, isCorrect === null ? {} : isCorrect ? styles.wordCorrect : styles.wordIncorrect]}>
                    {targetWord ? targetWord.charAt(0).toUpperCase() + targetWord.slice(1) : ''}
                </Text>
                <AudioPlayer buttonStyle={styles.audioButton} imgStyle={styles.playButton} audioUrl={targetAudioUrl}/>
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
    referenceButton: {
        position: 'absolute',
        height: 60,
        left: -40,
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