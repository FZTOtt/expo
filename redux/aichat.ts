import { PhraseExerciseType, WordExerciseType } from "@/types/exerciseTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Message = {
    id: string;
    text: string;
    isUser: boolean;
};

interface AiChat {
    messages: Message[],
    showLoadMessage: boolean,
    wordsMessages: Message[],
    showWordsLoad: boolean,
    phrasesMessages: Message[],
    showPhrasesLoad: boolean
}

const initialState: AiChat = {
    messages: [],
    showLoadMessage: false,
    wordsMessages: [],
    showWordsLoad: false,
    phrasesMessages: [],
    showPhrasesLoad: false
}

const aiChatSlice = createSlice({
    name: 'aichat',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.messages = []
        },
        writeMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload)
        },
        setShowLoadMessage: (state, action: PayloadAction<boolean>) => {
            state.showLoadMessage = action.payload
        },
        clearWordsMessages: (state) => {
            state.wordsMessages = []
        },
        writeWordsMessage: (state, action: PayloadAction<Message>) => {
            state.wordsMessages.push(action.payload)
        },
        setShowWordsLoad: (state, action: PayloadAction<boolean>) => {
            state.showWordsLoad = action.payload
        },
        clearPhrasesMessages: (state) => {
            state.phrasesMessages = []
        },
        writePhrasesMessage: (state, action: PayloadAction<Message>) => {
            state.phrasesMessages.push(action.payload)
        },
        setShowPhrasesLoad: (state, action: PayloadAction<boolean>) => {
            state.showPhrasesLoad = action.payload
        },
    }
})

export const {  clearMessages, writeMessage, setShowLoadMessage, 
                clearWordsMessages, writeWordsMessage, setShowWordsLoad,
                clearPhrasesMessages, writePhrasesMessage, setShowPhrasesLoad 
                    } = aiChatSlice.actions;
                    
export default aiChatSlice.reducer;