import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardState {
    requestOnboard: boolean;
}

const initialState: OnboardState = {
    requestOnboard: true,
}

const onboardSlice = createSlice({
    name: 'onboard',
    initialState,
    reducers: {
        setRequestOnboard: (state, action: PayloadAction<boolean>) => {
            state.requestOnboard = action.payload;
        },
    }
});

export const { setRequestOnboard } = onboardSlice.actions;
export default onboardSlice.reducer;