import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TargetWord from "@/interfaces/targetWord";
interface TranslatedState {
    translatedAudio: string | null;
    isCorrect: boolean | null;
    targetWord: string | null;
    targetTranscription: string | null;
    targetAudioUrl: string | null;
}

const initialState: TranslatedState = {
    translatedAudio: null,
    isCorrect: null,
    targetWord: null,
    targetTranscription: null,
    targetAudioUrl: null,
}

const translatedSlice = createSlice({
    name: 'translated',
    initialState,
    reducers: {
        setTranslatedAudio: (state, action: PayloadAction<string>) => {
            state.translatedAudio = action.payload;
            state.isCorrect = state.translatedAudio?.toLowerCase() === state.targetWord?.toLowerCase();
        },
        setTargetWord: (state, action: PayloadAction<TargetWord>) => {
            state.targetWord = action.payload.targetWord;
            state.targetTranscription = action.payload.targetTranscription;
            state.isCorrect = null;
        },
        setTargetAudioUrl: (state, action: PayloadAction<string>) => {
            state.targetAudioUrl = action.payload;
        },
    },
});

export const { setTranslatedAudio, setTargetWord, setTargetAudioUrl } = translatedSlice.actions;
export default translatedSlice.reducer;