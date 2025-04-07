import WordStatisticProps from "@/interfaces/wordStatisticProps";
import React from "react";
import { View, StyleSheet, Text } from "react-native";



const WordStatistic = ({word, accuracy}: WordStatisticProps) => {

    return(
        <View style={styles.container}>
            <Text>
                {word}
            </Text>
            <Text>
                {accuracy}
            </Text>
        </View>
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