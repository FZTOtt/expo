import { StyleSheet, View } from "react-native"
import Target from "./target"
import Manage from "./manage"
import Chat from "./chat"
import { useAppDispatch, useAppSelector, useTranscriptionParser } from "@/hooks"
import { RootState } from "@/redux/store"
import { getPhraseTranscrible } from "@/api/api"
import { setDetectedPhrase } from "@/redux/phrases"
import { clearPhrasesMessages, setShowLoadMessage } from "@/redux/aichat"
import { useEffect, useState } from "react"

const PhrasePronounce = ({handleNext} : {handleNext: (correct: boolean) => void}) => {
    const dispatch = useAppDispatch();
    const { ParseWordsFromSentence } = useTranscriptionParser();
    const { targetPhrase, targetAudioUrl, detectedPhrase } = useAppSelector((state: RootState) => state.phrases);
    const [completed, setCompleted] = useState<boolean>(false)

    const originalWords = ParseWordsFromSentence(targetPhrase ? targetPhrase : '');
    const detectedWords = ParseWordsFromSentence(detectedPhrase ? detectedPhrase : '');

    const handleRecordingComplete = async (audio: Blob | string) => {
        dispatch(setShowLoadMessage(true))
        const [status, response] = await getPhraseTranscrible(audio);
        if (status === 200) {
            dispatch(setDetectedPhrase(response.text));
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
    }

    useEffect(() => {
        if (originalWords.length !== detectedWords.length) {
            setCompleted(false)
            return
        }
        for (let i = 0; i < originalWords.length; ++i) {
            if (originalWords[i] !== detectedWords[i]) {
                setCompleted(false)
                return
            };
        }
        setCompleted(true)
    }, [detectedWords])

    const getNextExercise = () => {
        dispatch(clearPhrasesMessages())
        handleNext(completed)
    }

    return (
        <View style={styles.container}>
            <Target mode='phrase' 
            audioUrl={targetAudioUrl ? targetAudioUrl : ''} 
            target={originalWords}
            answer={detectedWords}
            // word={targetPhrase ? targetPhrase : ''}
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
        flex: 1,
    }
})

export default PhrasePronounce;