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

    console.log(audioUrl)

    const { translatedTranscriptions } = useAppSelector((state: RootState) => state.word)
    const { detectedPhrase } = useAppSelector((state: RootState) => state.phrases)

    const HighlightedComparison = ({ original, detected }) => {
        
        const originalWords = original.trim().split(/\s+/);
        if (!detected) {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {originalWords.map((word, index) => {
                        return (
                            <Text
                                key={index}
                                style={{
                                    color: 'white',
                                    fontSize: 60,
                                    paddingLeft: 15
                                }}
                            >
                                {word}
                            </Text>
                        );
                    })}
                </View>
            )
        }
        const detectedWords = detected
        .replace(/[.,!?;:"“”()]/g, '')
        .trim()
        .split(/\s+/);
    
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                {originalWords.map((word, index) => {
                    const match = detectedWords[index]?.toLowerCase() === word.toLowerCase();
                    return (
                        <Text
                            key={index}
                            style={{
                                color: match ? 'green' : 'red',
                                fontSize: 60,
                                paddingLeft: 15
                            }}
                        >
                            {word}
                        </Text>
                    );
                })}
            </View>
        );
    };

    const cleanTranscription = (text: string) => 
        text.replace(/[ˈˌ]/g, '').toLowerCase();

    const HighlightedTranscription = ({ transcription, detectedTranscription }) => {
        
        const originalPhonemes = transcription.trim().split('');
        if (!detectedTranscription) {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 5 }}>
                {originalPhonemes.map((ph, index) => {
                    return (
                        <Text
                            key={index}
                            style={{
                                color: 'white',
                                fontSize: 60
                            }}
                        >
                            {ph}
                        </Text>
                    );
                })}
            </View>
            )
        }
        const detectedPhonemes = detectedTranscription.split('');
    
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 5 }}>
                {originalPhonemes.map((ph, index) => {
                    const match = cleanTranscription(detectedPhonemes[index] || '') === cleanTranscription(ph);
                    return (
                        <Text
                            key={index}
                            style={{
                                color: match ? 'green' : 'red',
                                fontSize: 60
                            }}
                        >
                            {ph}
                        </Text>
                    );
                })}
            </View>
        );
    };
    const handleMode = () => {
        if (mode === 'word') {
            return (
                <>
                    <View style={styles.wordContainer}>
                        <HighlightedTranscription transcription={transcription} detectedTranscription={translatedTranscriptions[0]} />
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
                    <HighlightedComparison original={word} detected={detectedPhrase} />
                    <AudioPlayer buttonStyle={styles.audioButton} audioUrl={audioUrl}>
                        <PlaySound 
                            width={30} height={30}
                        />
                    </AudioPlayer>
                </View>
                <Text style={styles.word}>
                    {transcription} 
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