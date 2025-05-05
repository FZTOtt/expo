import { useAppSelector } from "@/hooks"
import { RootState } from "@/redux/store"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import AudioPlayer from "./audioPlayer"
import PlaySound from '@/assets/icons/soundCurrentColor.svg'
import { useEffect, useState } from "react"

const completeChain = ({handleNext}) => {
    const { audio } = useAppSelector((state: RootState) => state.phrases)
    const chain = [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six'
    ]
    const [availableWords, setAvailableWords] = useState<string[]>([])
    const [selectedWords, setSelectedWords] = useState<string[]>([])

    useEffect(() => {
        setAvailableWords(chain)
        setSelectedWords([])
    }, [])

    const handleWordPress = (word: string) => {
        setAvailableWords(prev => prev.filter(w => w !== word))
        setSelectedWords(prev => [...prev, word])
    }

    const handleSelectedPress = (word: string) => {
        setSelectedWords(prev => prev.filter(w => w !== word))
        setAvailableWords(prev => [...prev, word])
    }

    return (
        <View style={styles.container}>
            <Text style={styles.exerciseText}>
                Составьте предложение
            </Text>
            <AudioPlayer audioUrl={audio} buttonStyle={styles.wordAudio}>
                <PlaySound color={'rgb(0, 0, 0)'}
                    width={50} height={50}
                />
            </AudioPlayer>
            <View style={styles.chainHolder}>
                {selectedWords.map((word, index) => (
                    <TouchableOpacity 
                        key={index} 
                        onPress={() => handleSelectedPress(word)}
                        style={styles.wordItem}
                    >
                        <Text style={styles.wordText}>{word}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.wordList}>
                {availableWords.map((word, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleWordPress(word)}
                        style={styles.wordItem}
                    >
                        <Text style={styles.wordText}>{word}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.checkButton} onPress={handleNext}>
                <Text style={styles.checkText}>
                    Проверить
                </Text>
                
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRightWidth: 2,
        borderColor: 'rgba(82, 101, 109, 1)',
        paddingTop: '5%',
        alignItems: 'center',
        gap: 50,
        paddingBottom: 50,
    },
    exerciseText: {
        fontSize: 40,
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
    chainHolder: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'rgba(82, 101, 109, 1)',
        height: 100,
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 30
    },
    wordItem: {
        backgroundColor: 'rgba(73, 192, 248, 0.3)',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    wordText: {
        color: 'white',
        fontSize: 18,
    },
    wordList: {
        flexDirection: 'row',
        gap: 30
    },
    checkButton: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'green',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    checkText: {
        color: 'white',
        fontSize: 25
    }
})

export default completeChain;