import { useAppDispatch } from "@/hooks";
import WordStatisticProps from "@/interfaces/wordStatisticProps";
import { setReloadTargetWord } from "@/redux/translated";
import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";


const WordStatistic = ({word, accuracy}: WordStatisticProps) => {

    const dispatch = useAppDispatch();
    
    const handlePress = () => {
        dispatch(setReloadTargetWord(word));
        router.push('/');
    };
    return(
        <TouchableOpacity style={styles.container} onPress = {handlePress}>
            <Text>
                {word}
            </Text>
            <Text>
                {accuracy}%
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
})

export default WordStatistic;