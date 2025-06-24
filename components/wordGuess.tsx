import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AudioPlayer from "./audioPlayer";
import PlaySound from '@/assets/icons/soundCurrentColor.svg'
import { useState } from "react";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useTheme } from "@/hooks/useThemes";

const WordGuess = ({handleNext} : {handleNext: (correct: boolean) => void}) => {

    const { targetWords, targetAudioUrls } = useAppSelector((state: RootState) => state.word);

    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const random = Math.round(Math.random());
    const correctWord = targetWords[random];

    const { deviceType } = useWindowDimensions();
    const { fontSizes, buttonSizes } = useTheme();

    const handleWordPress = (word: string) => {
        if (selectedWord !== null) return;
        
        const correct = word == correctWord;
        setSelectedWord(word)
        setIsCorrect(correct);
        
        setTimeout(() => {
            handleNext(correct)
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.exerciseText, {fontSize: fontSizes.exerciseTask}]}>
                Какое слово звучит?
            </Text>
            <AudioPlayer audioUrl={targetAudioUrls[random]} buttonStyle={styles.wordAudio}>
                <PlaySound color={'rgb(0, 0, 0)'}
                    width={50} height={50}
                />
            </AudioPlayer>
            <View style={[styles.variants, deviceType === 'mobile' && {marginTop: 300, gap: 20}]}>
                {targetWords.map((word, index) => (
                    <TouchableOpacity key={index} 
                    style={[
                        styles.wordButton,
                        {
                            paddingHorizontal: buttonSizes.horizontalLarge,
                            paddingVertical: buttonSizes.verticalLarge,
                            borderRadius: buttonSizes.borderRadius
                        },
                        word === selectedWord && { backgroundColor: 'rgba(73, 192, 248, 1)' },
                        word === selectedWord && isCorrect && { backgroundColor: 'green' },
                        word === selectedWord && isCorrect === false && { backgroundColor: 'red' }
                    ]}
                    onPress={()=>handleWordPress(word)}>
                        <Text style={{fontSize: fontSizes.medium}}>
                            {word}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    exerciseText: {
        color: 'white',
        textAlign: 'center',
        paddingVertical: 10
    },
    wordAudio: {
        height: 120,
        width: 120,
        backgroundColor: 'rgba(73, 192, 248, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    variants: {
        flexDirection: 'row',
        gap: 40,
        marginTop: 400
    },
    wordButton: {
        backgroundColor: 'white',
    },
    wordButtonText: {
        fontSize: 30,
    }
})

export default WordGuess;