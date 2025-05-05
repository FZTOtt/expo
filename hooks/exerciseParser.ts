import { PhrasesExerciseApiResponse, WordExerciseApiResponse } from "@/interfaces/apiResponses";
import { useAppDispatch } from "./useAppDispatch";
import { setPhraseExercise, setWordExercise } from "@/redux/exercise";
import { PhraseChain, TargetPhrase, TargetWord } from "@/interfaces/reduxInterfaces";
import { setWordDetails } from "@/redux/word";
import { setChain, setTargetPhrase } from "@/redux/phrases";

export const useExerciseParser = () => {
    const dispatch = useAppDispatch();

    const parseWordExercise = (response: WordExerciseApiResponse) => {
        dispatch(setWordExercise(response.exercise_type))
        if (response.exercise_type === 'pronounce') {
            response.audio.map((url) => {
                url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
                url = url.replace(/&/g, '\\u0026');
                return url
            })
            const parsedWords: TargetWord = {
                targetWords: response.words,
                targetTranscriptions: response.transcriptions,
                targetAudioUrls: response.audio,
                wordTranslations: response.translations
            }
            dispatch(setWordDetails(parsedWords))
        }
    }

    const parsePhrasesExercise = (response: PhrasesExerciseApiResponse) => {
        dispatch(setPhraseExercise(response.exercise_type))
        if (response.exercise_type === 'pronounce') {
            let url = response.audio;
            url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
            url = url.replace(/&/g, '\\u0026');
            console.log(response.transcription)
            const parsedPhrase: TargetPhrase = {
                targetPhrase: response.sentence ? response.sentence : null,
                targetTranscription: response.transcription ? response.transcription : null,
                targetAudioUrl: url,
                translatedPhrase: response.translate ? response.translate : null,
            }
            dispatch(setTargetPhrase(parsedPhrase))
            dispatch(setChain({
                chain: [],
                audio: ''
            }))
        } else if (response.exercise_type === 'completeChain') {
            let url = response.audio;
            url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
            url = url.replace(/&/g, '\\u0026');

            const parsedChain: PhraseChain = {
                chain: response.chain ? response.chain : [],
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

    return {
        parseWordExercise,
        parsePhrasesExercise    
    };
}