import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Пример API-запросов (замените на свои)
const apiRegister = async (email: string, password: string) => {
    // Здесь должен быть реальный запрос к серверу
    return { email };
};
const apiUpdatePassword = async (oldPassword: string, newPassword: string) => {
    // Здесь должен быть реальный запрос к серверу
    return true;
};

// Асинхронные экшены
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const response = await apiRegister(email, password);
            return response.email;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Ошибка регистрации");
        }
    }
);

export const updatePassword = createAsyncThunk(
    "user/updatePassword",
    async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, thunkAPI) => {
        try {
            await apiUpdatePassword(oldPassword, newPassword);
            return true;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Ошибка смены пароля");
        }
    }
);

interface UserState {
    email: string | null;
    isAuthorized: boolean;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: UserState = {
    email: null,
    isAuthorized: false,
    status: "idle",
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.email = null;
            state.isAuthorized = false;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Регистрация
            .addCase(registerUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = "succeeded";
                state.email = action.payload;
                state.isAuthorized = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            // Смена пароля
            .addCase(updatePassword.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;