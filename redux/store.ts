import { configureStore } from "@reduxjs/toolkit";
import translatedReducer from "./translated";
import modalReducer from './modal';

const store = configureStore({
    reducer: {
        translated: translatedReducer,
        modal: modalReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;