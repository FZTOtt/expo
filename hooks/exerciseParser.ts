import { PhrasesExerciseApiResponse, WordExerciseApiResponse } from "@/interfaces/apiResponses";
import { useAppDispatch } from "./useAppDispatch";
import { setPhraseExercise, setWordExercise } from "@/redux/exercise";
import { PhraseChain, TargetPhrase, TargetWord } from "@/interfaces/reduxInterfaces";
import { setDetectedTranscription, setWordDetails } from "@/redux/word";
import { setChain, setDetectedPhrase, setTargetPhrase } from "@/redux/phrases";

export const useExerciseParser = () => {
    const dispatch = useAppDispatch();

    const parseWordExercise = (response: WordExerciseApiResponse) => {
        dispatch(setWordExercise(response.exercise_type))
        if (response.exercise_type === 'pronounce') {
            // const urls = response.audio.map((url) => {
            //     // url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
            //     // url = url.replace(/&/g, '\\u0026');
            //     url = 'http://localhost:3000' + url
            //     return url
            // })
            const urls = response.audio.map((url) => `https://ouzistudy.ru/media${url}`);
            const parsedWords: TargetWord = {
                targetWords: response.words,
                targetTranscriptions: response.transcriptions,
                targetAudioUrls: urls,
                wordTranslations: response.translations
            }
            dispatch(setWordDetails(parsedWords))
            dispatch(setDetectedTranscription([]))
        } else if (response.exercise_type === 'guessWord') {
            const urls = response.audio.map((url) => `https://ouzistudy.ru/media${url}`);
            console.log(response.words)
            const parsedWords: TargetWord = {
                targetWords: response.words,
                targetTranscriptions: response.transcriptions,
                targetAudioUrls: urls,
                wordTranslations: response.translations
            }
            dispatch(setWordDetails(parsedWords))
        }
    }

    const parsePhrasesExercise = (response: PhrasesExerciseApiResponse) => {
        dispatch(setPhraseExercise(response.exercise_type))
        if (response.exercise_type === 'pronounce') {
            let url = response.audio;
            // url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
            // url = url.replace(/&/g, '\\u0026');
            url = 'https://ouzistudy.ru/media' + url
            console.log(url)
            const parsedPhrase: TargetPhrase = {
                targetPhrase: response.sentence ? response.sentence : null,
                targetTranscription: response.transcription ? response.transcription : null,
                targetAudioUrl: url,
                translatedPhrase: response.translate ? response.translate : null,
            }
            dispatch(setTargetPhrase(parsedPhrase))
            dispatch(setDetectedPhrase(''))
            dispatch(setChain({
                chain: [],
                audio: '',
                sentence: ''
            }))
        } else if (response.exercise_type === 'completeChain') {
            let url = response.audio;
            // url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
            // url = url.replace(/&/g, '\\u0026');
            
            url = 'https://ouzistudy.ru/media' + url

            const parsedChain: PhraseChain = {
                chain: response.chain ? response.chain : [],
                sentence: response.sentence ? response.sentence : '',
                audio: url
            }
            dispatch(setChain(parsedChain))
            dispatch(setTargetPhrase({
                targetAudioUrl: '',
                targetPhrase: null,
                targetTranscription: null,
                translatedPhrase: null,
            }))
        }
    }

    const deletePhraseExercise = () => {

    }

    return {
        parseWordExercise,
        parsePhrasesExercise    
    };
}