import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TargetWord } from "@/interfaces/reduxInterfaces";

interface WordState {
    targetWords: string[];
    targetTranscriptions: string[];
    targetAudioUrls: string[];
    translatedTranscriptions: string[];
    wordTranslations: string[];
    id: number | null;
}

const initialState: WordState = {
    targetWords: [],
    targetTranscriptions: [],
    targetAudioUrls: [],
    translatedTranscriptions: [],
    wordTranslations: [],
    id: null,
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
            state.id = action.payload.id
        },
        setDetectedTranscription: (state, action: PayloadAction<string[]>) => {
            state.translatedTranscriptions = action.payload
        }
    }
})

export const { setWordDetails, setDetectedTranscription } = wordSlice.actions;
export default wordSlice.reducer