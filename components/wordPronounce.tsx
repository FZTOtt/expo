import { StyleSheet, View } from "react-native"
import Target from "./target"
import Manage from "./manage"
import Chat from "./chat"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { RootState } from "@/redux/store"
import { getWordTranscrible } from "@/api/api"
import { setDetectedTranscription } from "@/redux/word"

const WordPronounce = ({handleNext}) => {
    const dispatch = useAppDispatch();
    const { targetWords, targetTranscriptions, targetAudioUrls } = useAppSelector((state: RootState) => state.word);

    const handleRecordingComplete = async (audio: Blob | string) => {
        const [status, response] = await getWordTranscrible(audio);

        const trans = []
        trans[0] = response.transcription
        if (status === 200) {
            dispatch(setDetectedTranscription(trans));
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
    }

    return (
        <View style={styles.container}>
            <Target mode="word" 
            audioUrl={targetAudioUrls[0]} 
            transcription={targetTranscriptions[0]} 
            word={targetWords[0]}
            />
            <Chat/>
            <Manage onRecordComplete={handleRecordingComplete} onNext={handleNext}/>
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