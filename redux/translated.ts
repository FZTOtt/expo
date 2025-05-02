import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TargetWord from "@/interfaces/reduxInterfaces";

interface TranslatedState {
    translatedAudio: string | null;
    isCorrect: boolean | null;
    targetWord: string | null;
    targetTranscription: string | null;
    targetAudioUrl: string | null;
    reloadWord: string | null;
    tags: string;
    completedWords: number | null;
    totalWords: number | null;
    wordId: number;
    sendStat: boolean;
    usersRecord: string | null;
}

const initialState: TranslatedState = {
    translatedAudio: null,
    isCorrect: null,
    targetWord: null,
    targetTranscription: null,
    targetAudioUrl: null,
    reloadWord: null,
    tags: '',
    completedWords: null,
    totalWords: null,
    wordId: -1,
    sendStat: false,
    usersRecord: null
}

const translatedSlice = createSlice({
    name: 'translated',
    initialState,
    reducers: {
        setTranslatedAudio: (state, action: PayloadAction<string>) => {
            state.translatedAudio = action.payload;
            state.isCorrect = null
            if (state.targetTranscription) {
                console.log(state.targetTranscription.replace(/[ˈˌ]/g, ''), state.translatedAudio.replace(/[ˈˌ]/g, ''))
                state.isCorrect = state.targetTranscription.replace(/[ˈˌ]/g, '') === 
                 state.translatedAudio.replace(/[ˈˌ]/g, '');
            }
            state.sendStat = true;
        },
        setTargetWord: (state, action: PayloadAction<TargetWord>) => {
            state.targetWord = action.payload.targetWord;
            state.targetTranscription = action.payload.targetTranscription;
            state.isCorrect = null;
        },
        setTargetAudioUrl: (state, action: PayloadAction<string>) => {
            state.targetAudioUrl = action.payload;
        },
        setReloadTargetWord: (state, action: PayloadAction<string | null>) => {
            state.reloadWord = action.payload
        },
        setTag: (state, action: PayloadAction<string>) => {
            state.tags = action.payload
        },
        setSendStat: (state) => {
            state.sendStat = false
        },
        setUsersRecording: (state, action: PayloadAction<string | null>) => {
            state.usersRecord = action.payload;
        },
        setTopicStatistic: (state, action) => {
            state.completedWords = action.payload.complitedWords;
            state.totalWords = action.payload.totalWords;
        }
    },
});

export const { setTranslatedAudio, setTargetWord, setTargetAudioUrl, setReloadTargetWord, setTag, setSendStat, setUsersRecording, setTopicStatistic } = translatedSlice.actions;
export default translatedSlice.reducer;