import TagStatistic from "@/components/tagStatistic";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Statistic = () => {
    return (
        <View>
            <TouchableOpacity onPress={() => router.back()}>
                <Text>← Назад</Text>
            </TouchableOpacity>
            <TagStatistic tag='tag1' accuracy={10}></TagStatistic>
        </View>
    )
}

export default Statistic;
