import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Statistic = () => {
    return (
        <View>
            <TouchableOpacity onPress={() => router.back()}>
                <Text>← Назад</Text>
            </TouchableOpacity>
            <Text>Статистика</Text>
        </View>
    )
}

export default Statistic;
