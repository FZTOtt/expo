import { PhraseExerciseType, WordExerciseType } from "@/types/exerciseTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Message = {
    id: string;
    text: string;
    isUser: boolean;
};

interface AiChat {
    messages: Message[]
}

const initialState: AiChat = {
    messages: []
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
        }
    }
})

export const { clearMessages, writeMessage } = aiChatSlice.actions;
export default aiChatSlice.reducer;