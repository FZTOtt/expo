import { View, Text, StyleSheet } from 'react-native';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/hooks/useAppSelector';
import AudioPlayer from './audioPlayer';
import PlaySound from '@/assets/icons/playSound.svg'

interface TargetProps {
    word: string;
    transcription: string;
    audioUrl: string;
    mode: 'word' | 'phrase';
}

const Target = ({word, transcription, audioUrl, mode}: TargetProps) => {

    const handleMode = () => {
        if (mode === 'word') {
            return (
                <>
                    <View style={styles.wordContainer}>
                        <Text style={[styles.transcription]}>
                            {transcription} trans              
                        </Text>
                        <AudioPlayer buttonStyle={styles.audioButton} audioUrl={audioUrl}>
                            <PlaySound 
                                width={30} height={30}
                            />
                        </AudioPlayer>
                    </View>
                    <Text style={styles.word}>
                        {word ? word.charAt(0).toUpperCase() + word.slice(1) : ''}
                    </Text>
                </>
            )
        } else return (
            <>
                <View style={styles.wordContainer}>
                    <Text style={[styles.transcription]}>
                        {word ? word.charAt(0).toUpperCase() + word.slice(1) : ''} 12            
                    </Text>
                    <AudioPlayer buttonStyle={styles.audioButton} audioUrl={audioUrl}>
                        <PlaySound 
                            width={30} height={30}
                        />
                    </AudioPlayer>
                </View>
                <Text style={styles.word}>
                    {transcription} trans 
                </Text>
            </>            
        )
    }

    return (
        <View style={styles.container}>
            {handleMode()}
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