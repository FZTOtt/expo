import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TargetWord } from "@/interfaces/reduxInterfaces";

interface WordState {
    targetWords: string[];
    targetTranscriptions: string[];
    targetAudioUrls: string[];
    translatedTranscriotions: string[];
    wordTranslations: string[];
}

const initialState: WordState = {
    targetWords: [],
    targetTranscriptions: [],
    targetAudioUrls: [],
    translatedTranscriotions: [],
    wordTranslations: [],
}

const wordSlice = createSlice({
    name: 'word',
    initialState,
    reducers: {
        setWordDetails: (state, action: PayloadAction<TargetWord> ) => {
            state.targetWords = action.payload.targetWords
            state.targetTranscriptions = action.payload.targetTranscriptions
            state.targetAudioUrls = action.payload.targetAudioUrls
            state.wordTranslations = action.payload.wordTranslations
        },
        setDetectedTranscription: (state, action: PayloadAction<string[]>) => {
            state.translatedTranscriotions = action.payload
        }
    }
})

export const { setWordDetails, setDetectedTranscription } = wordSlice.actions;
export default wordSlice.reducer