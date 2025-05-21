import { StyleSheet, View } from "react-native"
import Target from "./target"
import Manage from "./manage"
import Chat from "./chat"
import { useAppDispatch, useAppSelector, useTranscriptionParser } from "@/hooks"
import { RootState } from "@/redux/store"
import { getWordTranscrible } from "@/api/api"
import { setDetectedTranscription } from "@/redux/word"
import { clearWordsMessages, setShowLoadMessage } from "@/redux/aichat"
import { useEffect, useState } from "react"

const WordPronounce = ({handleNext} : {handleNext: (correct: boolean) => void}) => {
    const dispatch = useAppDispatch();
    const { targetWords, targetTranscriptions, targetAudioUrls, translatedTranscriptions } = useAppSelector((state: RootState) => state.word);
    const [completed, setCompleted] = useState<boolean>(false)
    
    const { ParseWordTranscription } = useTranscriptionParser();

    
    const originalPhonemes = ParseWordTranscription(targetTranscriptions[0])
    let detectedPhonemes: string[];
    // console.log(translatedTranscriptions[0])
    translatedTranscriptions[0] ? detectedPhonemes = ParseWordTranscription(translatedTranscriptions[0]) : detectedPhonemes = []

    const handleRecordingComplete = async (audio: Blob | string) => {

        dispatch(setShowLoadMessage(true))
        const [status, response] = await getWordTranscrible(audio);

        const trans = []
        trans[0] = response.transcription
        if (status === 200) {
            dispatch(setDetectedTranscription(trans));
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
    }

    useEffect(() => {
        if (originalPhonemes.length !== detectedPhonemes.length) {
            setCompleted(false)
            return
        }
        for (let i = 0; i < originalPhonemes.length; ++i) {
            if (originalPhonemes[i] !== detectedPhonemes[i]) {
                setCompleted(false)
                return
            };
        }
        setCompleted(true)
    }, [detectedPhonemes])

    const getNextExercise = () => {
        dispatch(clearWordsMessages())
        handleNext(completed)
    }

    return (
        <View style={styles.container}>
            <Target mode="word" 
            audioUrl={targetAudioUrls[0]} 
            target={originalPhonemes}
            answer={detectedPhonemes} 
            word={targetWords[0]}
            />
            <Chat/>
            <Manage onRecordComplete={handleRecordingComplete} 
            onNext={getNextExercise}
            completed={completed}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default WordPronounce;