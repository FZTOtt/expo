import { configureStore } from "@reduxjs/toolkit";
import translatedReducer from "./translated";
import modalReducer from './modal';
import onboardReducer from './onboard';

const store = configureStore({
    reducer: {
        translated: translatedReducer,
        modal: modalReducer,
        onboard: onboardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;