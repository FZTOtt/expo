import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PhraseChain, TargetPhrase } from "@/interfaces/reduxInterfaces";

interface PhraseState {
    targetPhrase: string | null;
    targetAudioUrl: string | null;
    translatedPhrase: string | null;
    targetTranscription: string | null;
    detectedPhrase: string | null;

    chain: string[];
    sentence: string | null;
    audio: string | null;
    currentChain: string[];
}

const initialState: PhraseState = {
    targetPhrase: null,
    targetAudioUrl: null,
    translatedPhrase: null,
    targetTranscription: null,
    detectedPhrase: null,

    chain: [],
    sentence: null,
    audio: null,
    currentChain: [],
}

const phraseSlice = createSlice({
    name: 'phrases',
    initialState,
    reducers: {
        setTargetPhrase: (state, action: PayloadAction<TargetPhrase> ) => {
            state.targetPhrase = action.payload.targetPhrase
            state.targetAudioUrl = action.payload.targetAudioUrl
            state.targetTranscription = action.payload.targetTranscription
            state.translatedPhrase = action.payload.translatedPhrase
        },
        setDetectedPhrase: (state, action: PayloadAction<string>) => {
            state.detectedPhrase = action.payload
        },
        setChain: (state, action: PayloadAction<PhraseChain>) => {
            state.chain = action.payload.chain;
            state.sentence = action.payload.sentence;
            state.audio = action.payload.audio;
        },
        setCurrentChain: (state, action: PayloadAction<string[]>) => {
            state.currentChain = action.payload;
        }
    }
})

export const { setTargetPhrase, setDetectedPhrase, setChain, setCurrentChain } = phraseSlice.actions;
export default phraseSlice.reducer