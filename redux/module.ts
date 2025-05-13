import { PhrasesExerciseApiResponse, WordExerciseApiResponse } from "@/interfaces/apiResponses";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModuleState {
    currentWordModuleId: number | null;
    currentPhraseModuleId: number | null;
    wordExercises: WordExerciseApiResponse[];
    phraseExercises: PhrasesExerciseApiResponse[];
    currentWordExerciseIndex: number;
    currentPhraseExerciseIndex: number;
}
  
const initialState: ModuleState = {
    currentWordModuleId: null,
    currentPhraseModuleId: null,
    wordExercises: [],
    phraseExercises: [],
    currentWordExerciseIndex: 0,
    currentPhraseExerciseIndex: 0,
};
  
const moduleSlice = createSlice({
    name: 'module',
    initialState,
    reducers: {
    setCurrentWordModule: (state, action: PayloadAction<{ id: number, exercises: WordExerciseApiResponse[] }>) => {
        state.currentWordModuleId = action.payload.id;
        state.wordExercises = action.payload.exercises;
        state.currentWordExerciseIndex = 0;
    },
    setCurrentPhraseModule: (state, action: PayloadAction<{ id: number, exercises: PhrasesExerciseApiResponse[] }>) => {
        state.currentPhraseModuleId = action.payload.id;
        state.phraseExercises = action.payload.exercises;
        state.currentPhraseExerciseIndex = 0;
    },
    nextWordExercise: (state) => {
        state.currentWordExerciseIndex++;
    },
    nextPhraseExercise: (state) => {
        state.currentPhraseExerciseIndex++;
    },
    },
});
  
export const { setCurrentWordModule, setCurrentPhraseModule, nextWordExercise, nextPhraseExercise } = moduleSlice.actions;
export default moduleSlice.reducer