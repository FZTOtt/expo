import { StyleSheet, View } from "react-native"
import Target from "./target"
import Manage from "./manage"
import Chat from "./chat"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { RootState } from "@/redux/store"
import { getPhraseExercise, translateAudio } from "@/api/api"
import { useExerciseParser } from "@/hooks/exerciseParser"
import { setDetectedTranscription } from "@/redux/word"

const PhrasePronounce = () => {
    const dispatch = useAppDispatch();
    const { parsePhrasesExercise } = useExerciseParser();
    const { targetPhrase, targetAudioUrl, targetTranscription } = useAppSelector((state: RootState) => state.phrases);

    const fetchWordPronounceExercise = async (module: string = '') => {
        
        const [status, response] = await getPhraseExercise('')
        
        if (status === 200) {
            parsePhrasesExercise(response)
        } else {
            console.error('Ошибка в запросе fetchRandomWord', response);
        }
    }

    const handleRecordingComplete = async (audio: Blob | string) => {
        const [status, response] = await translateAudio(audio, targetPhrase);
        if (status === 200) {
            dispatch(setDetectedTranscription(response.transcription));
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
    }

    function handleNextWord() {
        fetchWordPronounceExercise()
    }

    return (
        <View style={styles.container}>
            <Target mode='phrase' 
            audioUrl={targetAudioUrl} 
            transcription={targetTranscription}
            word={targetPhrase}
            />
            <Chat/>
            <Manage onRecordComplete={handleRecordingComplete} onNext={handleNextWord}/>
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
        paddingBottom: 50
    }
})

export default PhrasePronounce;