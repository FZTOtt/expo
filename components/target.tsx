import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/hooks/useAppSelector';
import Reference from '@/assets/icons/reference.svg';
import { useAppDispatch } from '@/hooks';
import { setVisible } from '@/redux/modal';
import AudioPlayer from './audioPlayer';

const Target = () => {
    const { targetWord, isCorrect, targetAudioUrl, targetTranscription } = useAppSelector((state: RootState) => state.translated);
    const { isVisible } = useAppSelector((state: RootState) => state.modal);
    const dispatch = useAppDispatch();

    function openReference() {
        dispatch(setVisible(!isVisible))
    }

    return (
        <View style={styles.container}>
            <View style={styles.wordContainer}>
                {/* <TouchableOpacity style={styles.referenceButton} onPress={openReference}>
                    <Reference width={30} height={30}></Reference>
                </TouchableOpacity> */}
                <Text style={[styles.transcription, isCorrect === null ? {} : isCorrect ? styles.wordCorrect : styles.wordIncorrect]}>
                    {targetTranscription}                    
                </Text>
                <AudioPlayer buttonStyle={styles.audioButton} imgStyle={styles.playButton} audioUrl={targetAudioUrl}/>
            </View>
            <Text style={styles.word}>
                {targetWord ? targetWord.charAt(0).toUpperCase() + targetWord.slice(1) : ''}

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
        flex: 1,
        flexDirection: 'row',
        gap: 20,
        marginLeft: 50
    },
    word: {
        fontSize: 20,
        marginTop: 10,
        color: 'white',
    },
    wordCorrect: {
        color: 'green',
    },
    wordIncorrect: {
        color: 'red',
    },
    audioButton: {
        // position: 'absolute',
        // height: 60,
        // right: -40,
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
        fontSize: 60,
        lineHeight: 60,
        color: 'white'
    }
});



export default Target;