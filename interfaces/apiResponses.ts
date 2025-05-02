import { PhraseExerciseType, WordExerciseType } from "@/types/exerciseTypes";

export interface PhonemeApiResponse {
    phonema: string;
    tipText: string;
    link: string;
    tipPicture?: string;
}

export interface WordExerciseApiResponse {
    exercise: WordExerciseType;
    words: string[];
    transcriptions: string[];
    audio: string[];
    translations: string[];
}

export interface PhrasesExerciseApiResponse {
    exercise: PhraseExerciseType;
    sentence?: string;
    translate?: string;
    trascription?: string;
    audio: string;
    chain?: string[];
}