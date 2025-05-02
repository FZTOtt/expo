import { PhraseExerciseType, WordExerciseType } from "@/types/exerciseTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Exercise {
    wordExercise: WordExerciseType | null;
    phraseExercise: PhraseExerciseType | null;
}

const initialState: Exercise = {
    wordExercise: null,
    phraseExercise: null,
}

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState,
    reducers: {
        setWordExercise: (state, action: PayloadAction<WordExerciseType>) => {
            state.wordExercise = action.payload;
        },
        setPhraseExercise: (state, action: PayloadAction<PhraseExerciseType>) => {
            state.phraseExercise = action.payload;
        }
    }
})

export const { setWordExercise, setPhraseExercise } = exerciseSlice.actions;
export default exerciseSlice.reducer