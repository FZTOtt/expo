import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

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
    <View>
        <TouchableOpacity onPress={onPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>{children}</Text>
        </TouchableOpacity>
    </View>
)

const styles = StyleSheet.create({
    backButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        // width: '20%',
        alignSelf: "flex-start",
        backgroundColor: 'blue',
        borderRadius: 5,
        margin: 10,
    },
    backButtonText: {
        fontSize: 20,
        color: 'white', 
    }
})

export default BackButton;