import { View, Text, StyleSheet } from 'react-native';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/hooks/useAppSelector';
import AudioPlayer from './audioPlayer';
import PlaySound from '@/assets/icons/playSound.svg'
import { FONT_SIZES } from '@/constants/theme';
import { useTheme } from '@/hooks/useThemes';
import { useState } from 'react';

interface TargetProps {
    word?: string;
    target: string[];
    answer: string[];
    audioUrl: string;
    mode: 'word' | 'phrase';
}
const Target = ({word, target, answer, audioUrl, mode}: TargetProps) => {

    
    const { targetTranscription } = useAppSelector((state: RootState) => state.phrases)

    const { fontSizes } = useTheme();

    const [phonemesWidth, setPhonemesWidth] = useState(0);

    const CompareWords = ({ targetWords, detectedWords }: { targetWords: string[]; detectedWords: string[] }) => {        
        
        if (detectedWords[0] === '') {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {targetWords.map((word, index) => {
                        return (
                            <Text
                                key={index}
                                style={{
                                    color: 'white',
                                    fontSize: fontSizes.xlarge,
                                    paddingLeft: 15
                                }}
                            >
                                {word}
                            </Text>
                        );
                    })}
                    <AudioPlayer buttonStyle={{alignSelf: 'center', paddingLeft: 15, paddingTop: 10}} audioUrl={audioUrl}>
                        <PlaySound 
                            width={30} height={30}
                        />
                    </AudioPlayer>
                </View>
            )
        }
        
    
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                {targetWords.map((word, index) => {
                    const match = detectedWords[index]?.toLowerCase() === word.toLowerCase();
                    return (
                        <Text
                            key={index}
                            style={{
                                color: match ? 'green' : 'red',
                                fontSize: fontSizes.xlarge,
                                paddingLeft: 15
                            }}
                        >
                            {word}
                        </Text>
                    );
                })}
                <AudioPlayer buttonStyle={{alignSelf: 'center', paddingLeft: 15, paddingTop: 10}} audioUrl={audioUrl}>
                    <PlaySound 
                        width={30} height={30}
                    />
                </AudioPlayer>
            </View>
        );
    };

    const HighlightedTranscription = ({ targetPhonemes, detectedPhonemes }: {targetPhonemes: string[], detectedPhonemes: string[]}) => {

        const phonemeCount = targetPhonemes.length
        
        if (detectedPhonemes.length === 0) {
            
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 5 }} onLayout={e => setPhonemesWidth(e.nativeEvent.layout.width)}>
                    {targetPhonemes.map((ph, index) => {
                        return (
                            <Text
                                key={index}
                                style={{
                                    color: 'white',
                                    fontSize: fontSizes.xlarge,
                                    // width: 20,
                                    // textAlign: 'center'
                                }}
                            >
                                {ph}
                            </Text>
                        );
                    })}
                    <AudioPlayer buttonStyle={[styles.audioButton, {left: phonemesWidth + 5, bottom: fontSizes.botDis}]} audioUrl={audioUrl}>
                        <PlaySound 
                            width={30} height={30}
                        />
                    </AudioPlayer>
                </View>
            )
        }
    
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 5 }} onLayout={e => setPhonemesWidth(e.nativeEvent.layout.width)}>
                {targetPhonemes.map((ph, index) => {
                    const match = detectedPhonemes[index] === ph;
                    return (
                        <Text
                            key={index}
                            style={{
                                color: match ? 'green' : 'red',
                                fontSize: fontSizes.xlarge
                            }}
                        >
                            {ph}
                        </Text>
                    );
                })}
                <AudioPlayer buttonStyle={[styles.audioButton, {left: phonemesWidth + 5, bottom: fontSizes.botDis}]} audioUrl={audioUrl}>
                    <PlaySound 
                        width={30} height={30}
                    />
                </AudioPlayer>
            </View>
        );
    };
    const handleMode = () => {
        if (mode === 'word') {
            return (
                <View style={styles.container}>
                    <View style={styles.wordContainer}>
                        <HighlightedTranscription targetPhonemes={target} detectedPhonemes={answer} />
                    </View>
                    <Text style={[styles.word, {fontSize: fontSizes.large}]}>
                        {word ? word.charAt(0).toUpperCase() + word.slice(1) : ''}
                    </Text>
                </View>
            )
        } else return (
            <View style={styles.container}>
                <View style={styles.wordContainer}>
                    <CompareWords targetWords={target} detectedWords={answer} />
                </View>
                <Text style={[styles.word, {fontSize: fontSizes.large}]}>
                    {targetTranscription} 
                </Text>
            </View>            
        )
    }

    return (
        handleMode()
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
        position: 'relative'
    },
    word: {
        marginTop: 10,
        color: 'white',
        textAlign: 'center'
    },
    wordCorrect: {
        color: 'green',
    },
    wordIncorrect: {
        color: 'red',
    },
    audioButton: {
        position: 'absolute',
    },
    playButton: {
        width: 30,
        height: 30,
    },
});



export default Target;