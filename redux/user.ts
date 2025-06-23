import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin, apiRegister, apiUpdatePassword } from "@/api/api";

export const restoreSession = createAsyncThunk(
  "user/restoreSession",
  async (_, thunkAPI) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        try {
            const res = await fetch('http://localhost:3001/apinode/me', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Ошибка авторизации");
            const data = await res.json();
            return { token, email: data.email };
        } catch (e: any) {
            return thunkAPI.rejectWithValue("Сессия истекла");
        }
    }
    return thunkAPI.rejectWithValue("Ввойдите или зарегистрируйтесь");
  }
);

// Асинхронные экшены
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async ({ email, password, name }: { email: string; password: string, name: string }, thunkAPI) => {
        try {
            const [status, response] = await apiRegister(email, password, name);
            // console.log(status,response)
            if (status === 200) {
                await AsyncStorage.setItem('userToken', response.token);
                return response.email;
            } else if (response && response.error) {
                return thunkAPI.rejectWithValue(response.error);
            } else {
                return thunkAPI.rejectWithValue("Ошибка регистрации");
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
            } else if (response && response.error) {
                return thunkAPI.rejectWithValue(response.error);
            } else {
                return thunkAPI.rejectWithValue("Ошибка входа");
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Ошибка входа");
        }
    }
);

export const updatePassword = createAsyncThunk(
    "user/updatePassword",
    async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, thunkAPI) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error("Нет токена авторизации");
            const [status, response] = await apiUpdatePassword(token, oldPassword, newPassword);
            if (status === 200) {
                return true;
            } else if (response && response.error) {
                return thunkAPI.rejectWithValue(response.error);
            } else {
                return thunkAPI.rejectWithValue("Ошибка смены пароля");
            }
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
        clearError: (state) => {
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
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
            })
            // Логин
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = "succeeded";
                state.email = action.payload;
                state.isAuthorized = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            // Восстановление сессии
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.isAuthorized = true;
                state.email = action.payload.email;
                state.status = "succeeded";
            })
            .addCase(restoreSession.rejected, (state, action) => {
                state.isAuthorized = false;
                state.email = null;
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError, setError } = userSlice.actions;
export default userSlice.reducer;