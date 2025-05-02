import { StyleSheet, View } from "react-native"
import Target from "./target"
import Manage from "./manage"
import Chat from "./chat"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { RootState } from "@/redux/store"
import { getWordExercise, translateAudio } from "@/api/api"
import { useExerciseParser } from "@/hooks/exerciseParser"
import { setDetectedTranscription } from "@/redux/word"

const WordPronounce = () => {
    const dispatch = useAppDispatch();
    const { parseWordExercise } = useExerciseParser();
    const { targetWords, targetTranscriptions, targetAudioUrls } = useAppSelector((state: RootState) => state.word);

    const fetchWordPronounceExercise = async (module: string = '') => {
        
        const [status, response] = await getWordExercise('')
        
        if (status === 200) {
            parseWordExercise(response)
        } else {
            console.error('Ошибка в запросе fetchRandomWord', response);
        }
    }

    const handleRecordingComplete = async (audio: Blob | string) => {
        const [status, response] = await translateAudio(audio, targetWords[0]);
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
            <Target mode="word" 
            audioUrl={targetAudioUrls[0]} 
            transcription={targetTranscriptions[0]} 
            word={targetWords[0]}
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

export default WordPronounce;