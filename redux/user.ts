import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin, apiRegister } from "@/api/api";

export const restoreSession = createAsyncThunk(
  "user/restoreSession",
  async (_, thunkAPI) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      // Можно сделать запрос к серверу для получения данных пользователя по токену
      return { token }; // или вернуть email, если храните его
    }
    return thunkAPI.rejectWithValue("Нет сессии");
  }
);

// Асинхронные экшены
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const [status, response] = await apiRegister(email, password);
            if (status === 200) {
                await AsyncStorage.setItem('userToken', response.token);
                return response.email;
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Ошибка регистрации");
        }
    }
);

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const [status, response] = await apiLogin(email, password);
            if (status === 200) {
                await AsyncStorage.setItem('userToken', response.token);
                return response.email;
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Ошибка входа");
        }
    }
);

export const updatePassword = createAsyncThunk(
    // "user/updatePassword",
    // async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, thunkAPI) => {
    //     try {
    //         await apiUpdatePassword(oldPassword, newPassword);
    //         return true;
    //     } catch (error: any) {
    //         return thunkAPI.rejectWithValue(error.message || "Ошибка смены пароля");
    //     }
    // }
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