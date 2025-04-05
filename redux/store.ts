import { configureStore } from "@reduxjs/toolkit";
import translatedReducer from "./translated";

const store = configureStore({
    reducer: {
        translated: translatedReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;