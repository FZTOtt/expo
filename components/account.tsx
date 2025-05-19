import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { RootState } from "@/redux/store";
import { loginUser, registerUser, updatePassword, logout, clearError, setError } from "@/redux/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Account = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState) => state.user);

    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [regEmail, setRegEmail] = useState<string>("");
    const [regPassword, setRegPassword] = useState<string>("");
    const [regConfirmPassword, setRegConfirmPassword] = useState<string>("");
    const [regName, setRegName] = useState<string>('')

    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");
    const [showRegister, setShowRegister] = useState(false);

    // Смена пароля
    const handleChangePassword = () => {
        dispatch(clearError())
        if (!password || !newPassword || newPassword !== confirmPassword) {
            dispatch(setError("Пароли не совпадают или не заполнены"));
            return;
        }
        dispatch(updatePassword({ oldPassword: password, newPassword }));
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    // Регистрация
    const handleRegister = () => {
        dispatch(clearError())
        if (!regEmail || !regPassword || regPassword !== regConfirmPassword) {
            dispatch(setError("Проверьте правильность заполнения полей"));
            return;
        }
        dispatch(registerUser({ email: regEmail, password: regPassword, name: regName }));
        setRegEmail("");
        setRegPassword("");
        setRegConfirmPassword("");
        setRegName("");
    };

    const handleLogin = () => {
        dispatch(clearError())
        if (!loginEmail || !loginPassword) {
            dispatch(setError("Введите почту и пароль"));
            return;
        }
        dispatch(loginUser({ email: loginEmail, password: loginPassword }));
        setLoginEmail("");
        setLoginPassword("");
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
        } catch (e) {}
        dispatch(logout());
    };

    return (
        <View style={styles.container}>
            {user.status === "loading" && (
                <ActivityIndicator size="large" color="#3f85a7" style={{ marginBottom: 16 }} />
            )}
            {user.error ? (
                <Text style={styles.errorText}>{user.error}</Text>
            ) : null}
            {user.isAuthorized ? (
                <>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Почта:</Text>
                        <Text style={styles.value}>{user.email}</Text>
                    </View>
                    <View style={styles.formBlock}>
                        <Text style={styles.formTitle}>Смена пароля</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Текущий пароль"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Новый пароль"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Повторите новый пароль"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={user.status === "loading"}>
                            <Text style={styles.buttonText}>Сменить пароль</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#b23b3b", marginTop: 16 }]} onPress={handleLogout}>
                            <Text style={styles.buttonText}>Выйти</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.formBlock}>
                    <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16 }}>
                        <TouchableOpacity onPress={() => setShowRegister(false)} style={[styles.switchButton, !showRegister && styles.switchButtonActive]}>
                            <Text style={[styles.switchButtonText, !showRegister && styles.switchButtonTextActive]}>Войти</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowRegister(true)} style={[styles.switchButton, showRegister && styles.switchButtonActive]}>
                            <Text style={[styles.switchButtonText, showRegister && styles.switchButtonTextActive]}>Регистрация</Text>
                        </TouchableOpacity>
                    </View>
                    {showRegister ? (
                        <>
                            <Text style={styles.formTitle}>Регистрация</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Почта"
                                value={regEmail}
                                onChangeText={setRegEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Имя"
                                value={regName}
                                onChangeText={setRegName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Пароль"
                                secureTextEntry
                                value={regPassword}
                                onChangeText={setRegPassword}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Повторите пароль"
                                secureTextEntry
                                value={regConfirmPassword}
                                onChangeText={setRegConfirmPassword}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={user.status === "loading"}>
                                <Text style={styles.buttonText}>Зарегистрироваться</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.formTitle}>Вход</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Почта"
                                value={loginEmail}
                                onChangeText={setLoginEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Пароль"
                                secureTextEntry
                                value={loginPassword}
                                onChangeText={setLoginPassword}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={user.status === "loading"}>
                                <Text style={styles.buttonText}>Войти</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: "center",
        borderRightWidth: 2,
        borderRightColor: 'rgba(82, 101, 109, 1)',
        alignItems: 'center'
    },
    infoBlock: {
        borderRadius: 10,
        padding: 16,
        marginBottom: 24,
        alignItems: "center",
    },
    label: {
        fontSize: 30,
        color: "white",
        fontWeight: "bold",
    },
    value: {
        fontSize: 24,
        color: "white",
        marginTop: 4,
    },
    formBlock: {
        borderRadius: 10,
        padding: 16,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: 'rgba(82, 101, 109, 1)',
        width: '50%',
    },
    formTitle: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        marginBottom: 12,
        alignSelf: "center",
        
    },
    input: {
        borderWidth: 1,
        borderColor: "#3f85a7",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: "#f6fafd",
    },
    button: {
        backgroundColor: 'rgba(63,133,167,1.00)',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 8,
        opacity: 1,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    switchButton: {
        flex: 1,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    switchButtonActive: {
        borderColor: "#3f85a7",
    },
    switchButtonText: {
        color: "#3f85a7",
        fontSize: 16,
        fontWeight: "bold",
    },
    switchButtonTextActive: {
        color: "white",
    },
    errorText: {
        color: "#b23b3b",
        fontSize: 16,
        marginBottom: 12,
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default Account;