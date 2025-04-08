import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TargetWord from "@/interfaces/targetWord";

interface TranslatedState {
    translatedAudio: string | null;
    isCorrect: boolean | null;
    targetWord: string | null;
    targetTranscription: string | null;
    targetAudioUrl: string | null;
    reloadWord: string | null;
    tags: string;
    wordId: number;
    sendStat: boolean;
}

const initialState: TranslatedState = {
    translatedAudio: null,
    isCorrect: null,
    targetWord: null,
    targetTranscription: null,
    targetAudioUrl: null,
    reloadWord: null,
    tags: '',
    wordId: -1,
    sendStat: false
}

const translatedSlice = createSlice({
    name: 'translated',
    initialState,
    reducers: {
        setTranslatedAudio: (state, action: PayloadAction<string>) => {
            state.translatedAudio = action.payload;
            state.isCorrect = state.translatedAudio?.toLowerCase() === state.targetWord?.toLowerCase();
            state.sendStat = true;
            console.log('setCorrect')
        },
        setTargetWord: (state, action: PayloadAction<TargetWord>) => {
            state.targetWord = action.payload.targetWord;
            state.targetTranscription = action.payload.targetTranscription;
            state.isCorrect = null;
            state.wordId = action.payload.wordId
        },
        setTargetAudioUrl: (state, action: PayloadAction<string>) => {
            state.targetAudioUrl = action.payload;
        },
        setReloadTargetWord: (state, action: PayloadAction<string>) => {
            state.reloadWord = action.payload
        },
        setTag: (state, action: PayloadAction<string>) => {
            state.tags = action.payload
        },
        setSendStat: (state) => {
            state.sendStat = false
            console.log(state.sendStat)
        }
    },
});

export const { setTranslatedAudio, setTargetWord, setTargetAudioUrl, setReloadTargetWord, setTag, setSendStat } = translatedSlice.actions;
export default translatedSlice.reducer;