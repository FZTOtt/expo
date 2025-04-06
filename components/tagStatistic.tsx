import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TagStatistic = ({ tag, accuracy }: TagStatisticProps) => {
    return (
        <View style={styles.container}>
            <Text>
                {tag}
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
    },
});

export default TagStatistic