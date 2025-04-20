import { useAppDispatch } from "@/hooks";
import WordStatisticProps from "@/interfaces/wordStatisticProps";
import { setReloadTargetWord } from "@/redux/translated";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";


const WordStatistic = ({word, completed}: WordStatisticProps) => {

    const dispatch = useAppDispatch();
    
    const handlePress = () => {
        dispatch(setReloadTargetWord(word));
        router.push('/');
    };
    return(
        <TouchableOpacity style={[styles.container, completed == 1 ? styles.completed : completed == -1 ? styles.passed : '']} onPress = {handlePress}>
            <Text>
                {word}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    completed: {
        borderColor: 'green',
    },
    passed: {
        borderColor: 'red',
    }
})

export default WordStatistic;