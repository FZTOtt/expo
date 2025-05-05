import { PhraseExerciseType, WordExerciseType } from "@/types/exerciseTypes";

export interface PhonemeApiResponse {
    phonema: string;
    tipText: string;
    link: string;
    tipPicture?: string;
}

export interface WordExerciseApiResponse {
    exercise_type: WordExerciseType;
    words: string[];
    transcriptions: string[];
    audio: string[];
    translations: string[];
    id: number,
    status: "completed" | "failed" | "none"
}

export interface PhrasesExerciseApiResponse {
    exercise_type: PhraseExerciseType;
    sentence?: string;
    translate?: string;
    transcription?: string;
    audio: string;
    chain?: string[];
    id: number,
    status: "completed" | "failed" | "none"
}