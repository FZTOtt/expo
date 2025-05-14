import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AudioPlayer from "./audioPlayer";
import PlaySound from '@/assets/icons/soundCurrentColor.svg'
import { useState } from "react";

const WordGuess = ({handleNext}) => {

    const { targetWords, targetAudioUrls } = useAppSelector((state: RootState) => state.word);

    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const random = Math.round(Math.random());
    const correctWord = targetWords[random];

    const handleWordPress = (word: string) => {
        if (selectedWord !== null) return;
        
        const correct = word == correctWord;
        setSelectedWord(word)
        setIsCorrect(correct);
        
        // задержка до следующего задания
        setTimeout(() => {
            handleNext()
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.exerciseText}>
                Какое слово звучит?
            </Text>
            <AudioPlayer audioUrl={targetAudioUrls[random]} buttonStyle={styles.wordAudio}>
                <PlaySound color={'rgb(0, 0, 0)'}
                    width={50} height={50}
                />
            </AudioPlayer>
            <View style={styles.variants}>
                {targetWords.map((word, index) => (
                    <TouchableOpacity key={index} 
                    style={[
                        styles.wordButton,
                        word === selectedWord && { backgroundColor: 'rgba(73, 192, 248, 1)' },
                        word === selectedWord && isCorrect && { backgroundColor: 'green' },
                        word === selectedWord && isCorrect === false && { backgroundColor: 'red' }
                    ]}
                    onPress={()=>handleWordPress(word)}>
                        <Text style={styles.wordButtonText}>
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
        maxWidth: 1200,
        borderRightWidth: 2,
        borderColor: 'rgba(82, 101, 109, 1)',
        paddingTop: '5%',
        gap: 50,
        paddingBottom: 50,
        alignItems: 'center'
    },
    exerciseText: {
        fontSize: 50,
        color: 'white'
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
        paddingHorizontal: 80,
        paddingVertical: 15,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    wordButtonText: {
        fontSize: 30,
    }
})

export default WordGuess;