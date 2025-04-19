import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TagStatisticProps } from '@interfaces/tagStatisticProps';

const TagStatistic = ({ tag, completedCount, totalCount, backgroundImage }: TagStatisticProps) => {

    const progress = completedCount / totalCount;

    // Цвета тени: от серого к зелёному
    const shadowColors: [string, string] = [
        `rgba(128, 128, 128, ${1 - progress})`, // Серый (уменьшается с прогрессом)
        `rgba(0, 255, 0, ${progress})`, // Зелёный (увеличивается с прогрессом)
    ];

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={backgroundImage} style={styles.tagImage}/>
            </View>
            <View style={styles.statistics}>
                <Text style={styles.tag}>
                    {tag}
                </Text>
                <Text style={styles.countText}>
                    {completedCount}/{totalCount}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5,
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
        width: '100%',
        shadowColor: 'green',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 20,
    },
    shadowContainer: {
        position: "relative",
        marginBottom: 10,
    },
    shadow: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 10, // Радиус тени
    },
    tag: {
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 10,
        width: '60%'
        
    },
    countText: {
        fontSize: 18,
        paddingHorizontal: 10,
        alignSelf: 'center'
    },
    tagImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    imageContainer: {
        width: '100%',
        overflow: 'hidden'
    },
    statistics: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        justifyContent: 'space-between',
        width: '100%'
    }
});

export default TagStatistic