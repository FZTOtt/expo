import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TagStatistic = ({ tag }: TagStatisticProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.tag}>
                {tag}
            </Text>
            {/* <View style={styles.accuracyContainer}>
                <Text style={styles.accuracyText}>
                    {accuracy}
                </Text>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1
    },
    tag: {
        fontSize: 16,
        fontWeight: '400',
    },
    accuracyContainer: {

    },
    accuracyText: {
        fontSize: 16,
        fontWeight: '500',
    }
});

export default TagStatistic