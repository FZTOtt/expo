import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
    isVisible: boolean;
    isVisibleMedia: boolean;
}

const initialState: ModalState = {
    isVisible: false,
    isVisibleMedia: false,
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setVisible: (state, action: PayloadAction<boolean>) => {
            state.isVisible = action.payload;
        },
        setVisibleMedia: (state, action: PayloadAction<boolean>) => {
            state.isVisibleMedia = action.payload
        },
    }
});

export const { setVisible, setVisibleMedia } = modalSlice.actions;
export default modalSlice.reducer;