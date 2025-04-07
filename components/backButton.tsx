import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

interface BackButtonProps {
    onPress?: () => void;
    children?: React.ReactNode;
}

const handleBack = () => {
    if (router.canGoBack()) {
        router.back();
    } else {
        router.replace('/');
    }
};

const BackButton: React.FC<BackButtonProps> = ({ onPress = () => handleBack(), children = 'Вернуться назад' }) => (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
        <Text style={styles.backButtonText}>{children}</Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    backButton: {
        padding: 20,
    },
    backButtonText: {
        fontSize: 20,
        color: 'blue', 
    }
})

export default BackButton;