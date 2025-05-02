import { PhrasesExerciseApiResponse, WordExerciseApiResponse } from "@/interfaces/apiResponses";
import { useAppDispatch } from "./useAppDispatch";
import { setPhraseExercise, setWordExercise } from "@/redux/exercise";
import { PhraseChain, TargetPhrase, TargetWord } from "@/interfaces/reduxInterfaces";
import { setWordDetails } from "@/redux/word";
import { PhraseExerciseType } from "@/types/exerciseTypes";
import { setChain, setTargetPhrase } from "@/redux/phrases";

export const useExerciseParser = () => {
    const dispatch = useAppDispatch();

    const parseWordExercise = (response: WordExerciseApiResponse) => {
        dispatch(setWordExercise(response.exercise))
        if (response.exercise === 'pronounce') {
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
        dispatch(setPhraseExercise(response.exercise))
        if (response.exercise === 'pronounce') {
            let url = response.audio;
            url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
            url = url.replace(/&/g, '\\u0026');
            const parsedPhrase: TargetPhrase = {
                targetPhrase: response.sentence ? response.sentence : null,
                targetTranscription: response.trascription ? response.trascription : null,
                targetAudioUrl: url,
                translatedPhrase: response.translate ? response.translate : null,
            }
            dispatch(setTargetPhrase(parsedPhrase))
            dispatch(setChain({
                chain: [],
                audio: ''
            }))
        } else if (response.exercise === 'completeChain') {
            let url = response.audio;
            url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
            url = url.replace(/&/g, '\\u0026');

            const parsedChain: PhraseChain = {
                chain: response.chain ? response.chain : null,
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