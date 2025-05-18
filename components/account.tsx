import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { RootState } from "@/redux/store";
import { registerUser, updatePassword } from "@/redux/user";

const Account = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState) => state.user);

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");

    // Для отображения ошибок и статусов
    useEffect(() => {
        if (user.error) {
            Alert.alert("Ошибка", user.error);
        }
    }, [user.error]);

    // Смена пароля
    const handleChangePassword = () => {
        if (!password || !newPassword || newPassword !== confirmPassword) {
            Alert.alert("Ошибка", "Пароли не совпадают или не заполнены");
            return;
        }
        dispatch(updatePassword({ oldPassword: password, newPassword }));
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    // Регистрация
    const handleRegister = () => {
        if (!regEmail || !regPassword || regPassword !== regConfirmPassword) {
            Alert.alert("Ошибка", "Проверьте правильность заполнения полей");
            return;
        }
        dispatch(registerUser({ email: regEmail, password: regPassword }));
        setRegEmail("");
        setRegPassword("");
        setRegConfirmPassword("");
    };

    return (
        <View style={styles.container}>
            {user.status === "loading" && (
                <ActivityIndicator size="large" color="#3f85a7" style={{ marginBottom: 16 }} />
            )}
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
                    </View>
                </>
            ) : (
                <View style={styles.formBlock}>
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
});

export default Account;