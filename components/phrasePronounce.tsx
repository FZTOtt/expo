import { StyleSheet, View } from "react-native"
import Target from "./target"
import Manage from "./manage"
import Chat from "./chat"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { RootState } from "@/redux/store"
import { getPhraseTranscrible } from "@/api/api"
import { setDetectedPhrase } from "@/redux/phrases"
import { setShowLoadMessage } from "@/redux/aichat"

const PhrasePronounce = ({handleNext}) => {
    const dispatch = useAppDispatch();
    const { targetPhrase, targetAudioUrl, targetTranscription } = useAppSelector((state: RootState) => state.phrases);

    const handleRecordingComplete = async (audio: Blob | string) => {
        dispatch(setShowLoadMessage(true))
        const [status, response] = await getPhraseTranscrible(audio);
        console.log(response)
        if (status === 200) {
            dispatch(setDetectedPhrase(response.text));
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
    }

    return (
        <View style={styles.container}>
            <Target mode='phrase' 
            audioUrl={targetAudioUrl} 
            transcription={targetTranscription}
            word={targetPhrase}
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

export default PhrasePronounce;