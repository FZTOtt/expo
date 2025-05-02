import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Manage from "./manage";
import { translateAudio } from "@/api/api";
import { setDetectedTranscription } from "@/redux/word";
import AudioPlayer from "./audioPlayer";

const PronounceFiew = () => {

    const words = [
        'dock',
        'deck'
    ]

    const dispatch = useAppDispatch();
    const { targetWords, targetAudioUrls } = useAppSelector((state: RootState) => state.word);
    const [selectedWord, setSelectedWord] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<(boolean | null)[]>(words.map(() => null));



    const handleWordPress = (index: number) => {
        setSelectedWord(index);
    };

    const handleRecordingComplete = async (audio: Blob | string) => {
        const [status, response] = await translateAudio(audio, targetWords[0]);
        if (status === 200) {
            dispatch(setDetectedTranscription(response.transcription));
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
        setIsCorrect(prev => {
            if (selectedWord === null) return prev
            const newStatus = [...prev]
            newStatus[selectedWord] = true
            return newStatus
        })
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.exerciseText}>
                Произнесите два похожих слова
            </Text>
            <View style={styles.variants}>
                {words.map((word, index) => (
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
            <Manage onNext={()=>{}} onRecordComplete={handleRecordingComplete}/>
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