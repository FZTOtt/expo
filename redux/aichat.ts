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
}

const initialState: AiChat = {
    messages: [],
    showLoadMessage: false,
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
        }
    }
})

export const { clearMessages, writeMessage, setShowLoadMessage } = aiChatSlice.actions;
export default aiChatSlice.reducer;