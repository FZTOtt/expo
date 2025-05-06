import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Manage from "./manage";
import { getWordTranscrible, translateAudio } from "@/api/api";
import { setDetectedTranscription } from "@/redux/word";
import AudioPlayer from "./audioPlayer";

const PronounceFiew = ({handleNext}) => {

    const dispatch = useAppDispatch();

    const { targetWords, targetAudioUrls } = useAppSelector((state: RootState) => state.word);
    
    const [selectedWord, setSelectedWord] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<(boolean | null)[]>(targetWords.map(() => null));



    const handleWordPress = (index: number) => {
        setSelectedWord(index);
    };

    const cleanPhonemes = (str: string) => str.replace(/[ˈˌ]/g, '').split('');

    const handleRecordingComplete = async (audio: Blob | string) => {
        const [status, response] = await getWordTranscrible(audio);
        if (status === 200) {
            dispatch(setDetectedTranscription(response.transcription));
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
        const originalPhonemes = cleanPhonemes(targetWords[selectedWord]);
        const detectedPhonemes = cleanPhonemes(response.transcription);

        const areEqual = (
            originalPhonemes.length === detectedPhonemes.length &&
            originalPhonemes.every((val, i) => val === detectedPhonemes[i])
        );

        setIsCorrect(prev => {
            if (selectedWord === null) return prev
            const newStatus = [...prev]
            newStatus[selectedWord] = areEqual
            return newStatus
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.exerciseText}>
                Произнесите два похожих слова
            </Text>
            <View style={styles.variants}>
                {targetWords.map((word, index) => (
                    <AudioPlayer audioUrl={targetAudioUrls[index]} 
                    buttonStyle={[
                        styles.wordButton,
                        index === selectedWord && { backgroundColor: 'rgba(73, 192, 248, 1)' },
                        isCorrect[index] && { backgroundColor: 'green' },
                        isCorrect[index] === false && { backgroundColor: 'red' }
                    ]}
                    onPress={()=>handleWordPress(index)}
                    key={index}
                    disabled={isCorrect[index] === true}>
                        <Text style={styles.wordButtonText}>
                            {word}
                        </Text>
                    </AudioPlayer>
                ))}
            </View>
            <Manage onNext={handleNext} onRecordComplete={handleRecordingComplete}/>
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
    variants: {
        flexDirection: 'row',
        gap: 40,
        marginBottom: 450
    },
    wordButton: {
        paddingHorizontal: 80,
        paddingVertical: 15,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    wordButtonText: {
        fontSize: 30,
    },
})

export default PronounceFiew;