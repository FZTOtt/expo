import { configureStore } from "@reduxjs/toolkit";
import translatedReducer from "./translated";
import modalReducer from './modal';
import onboardReducer from './onboard';
import wordReducer from './word'
import phrasesReducer from './phrases';
import exerciseReducer from './exercise';
import moduleReducer from './module';
import aiChatReducer from './aichat';

const store = configureStore({
    reducer: {
        translated: translatedReducer,
        modal: modalReducer,
        onboard: onboardReducer,
        word: wordReducer,
        phrases: phrasesReducer,
        exercise: exerciseReducer,
        module: moduleReducer,
        aiChat: aiChatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;