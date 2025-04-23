import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardState {
    requestOnboard: boolean;
    isOnboarding: boolean;
    finished: boolean;
}

const initialState: OnboardState = {
    requestOnboard: true,
    isOnboarding: false,
    finished: true,
}

const onboardSlice = createSlice({
    name: 'onboard',
    initialState,
    reducers: {
        setRequestOnboard: (state, action: PayloadAction<boolean>) => {
            state.requestOnboard = action.payload;
        },
        setOnboarding: (state, action: PayloadAction<boolean>) => {
            state.isOnboarding = action.payload;
        },
        setFinished: (state, action: PayloadAction<boolean>) => {
            state.finished = action.payload;
        },
    }
});

export const { setRequestOnboard, setOnboarding, setFinished } = onboardSlice.actions;
export default onboardSlice.reducer;