import { useAppSelector } from "@/hooks"
import { RootState } from "@/redux/store"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import AudioPlayer from "./audioPlayer"
import PlaySound from '@/assets/icons/soundCurrentColor.svg'
import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/useThemes"
import { v4 as uuidv4 } from 'uuid'
import { useWindowDimensions } from "@/hooks/useWindowDimensions"

const completeChain = ({handleNext} : {handleNext: (correct: boolean) => void}) => {
    const { chain, audio, sentence } = useAppSelector((state: RootState) => state.phrases)
    const [availableWords, setAvailableWords] = useState<{id: string, word: string}[]>([])
    const [selectedWords, setSelectedWords] = useState<{id: string, word: string}[]>([])
    const [correct, setCorrect] = useState<boolean|null>(null)

    const { deviceType } = useWindowDimensions();

    const chainObjects = chain.map(word => ({ id: uuidv4(), word }));

    const { fontSizes, buttonSizes } = useTheme()

    useEffect(() => {
        setAvailableWords(chainObjects)
        setSelectedWords([])
    }, [chain])

    const handleWordPress = (wordObj: {id: string, word: string}) => {
        setAvailableWords(prev => prev.filter(w => w.id !== wordObj.id))
        setSelectedWords(prev => [...prev, wordObj])
    }

    const handleSelectedPress = (wordObj: {id: string, word: string}) => {
        setSelectedWords(prev => prev.filter(w => w.id !== wordObj.id))
        setAvailableWords(prev => [...prev, wordObj])
    }

    function checkChain() {
        if (sentence === null) return
        const isMatch = selectedWords.map(w => w.word).join(' ').toLowerCase() === sentence.toLowerCase();
        setCorrect(isMatch)
        setTimeout(()=>{
            handleNext(isMatch)
            setCorrect(null)
        }, 1500)
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.exerciseText, {fontSize: fontSizes.exerciseTask}]}>
                Составьте предложение
            </Text>
            <AudioPlayer audioUrl={audio} buttonStyle={styles.wordAudio}>
                <PlaySound color={'rgb(0, 0, 0)'}
                    width={50} height={50}
                />
            </AudioPlayer>
            {deviceType !== 'mobile' ? 
                <View style={styles.chainHolder}>
                    {selectedWords.map((wordObj, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => handleSelectedPress(wordObj)}
                            style={styles.wordItem}
                        >
                            <Text style={[styles.wordText, {fontSize: fontSizes.medium}]}>{wordObj.word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            :
                <View style={styles.chainHolder}>
                    <ScrollView
                        style={{maxHeight: 120}}
                        contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10}}
                    >
                        {selectedWords.map((wordObj, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleSelectedPress(wordObj)}
                                style={styles.wordItem}
                            >
                                <Text style={[styles.wordText, {fontSize: fontSizes.medium}]}>{wordObj.word}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            }
            {deviceType !== 'mobile' ? 
                <View style={styles.wordList}>
                    {availableWords.map((wordObj, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleWordPress(wordObj)}
                            style={styles.wordItem}
                        >
                            <Text style={[styles.wordText, {fontSize: fontSizes.medium}]}>{wordObj.word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            :
                <View style={styles.wordList}>
                    <ScrollView
                        style={{maxHeight: 120}}
                        contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10}}
                    >
                        {availableWords.map((wordObj, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleWordPress(wordObj)}
                                style={styles.wordItem}
                            >
                                <Text style={[styles.wordText, {fontSize: fontSizes.medium}]}>{wordObj.word}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            }
            <TouchableOpacity style={[
                styles.checkButton,
                correct && { backgroundColor: 'green' },
                correct == false && { backgroundColor: 'red', borderColor: 'red' }
            ]} onPress={checkChain}>
                <Text style={[styles.checkText, {fontSize: fontSizes.medium}]}>
                    Проверить
                </Text>
                
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
    },
    exerciseText: {
        fontSize: 40,
        color: 'white',
        textAlign: 'center'
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
        minHeight: 100,
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 30,
        flexWrap: 'wrap',
        paddingVertical: 20
    },
    wordItem: {
        backgroundColor: 'rgba(73, 192, 248, 0.3)',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    wordText: {
        color: 'white',
    },
    wordList: {
        flexDirection: 'row',
        gap: 30,
        flexWrap: 'wrap',
        paddingHorizontal: 20
    },
    checkButton: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'green',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    checkText: {
        color: 'white'
    }
})

export default completeChain;