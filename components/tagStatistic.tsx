import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TagStatisticProps } from '@interfaces/tagStatisticProps';
import { Circle, G, Svg } from "react-native-svg";

const TagStatistic = (props: TagStatisticProps & { isStatistic?: boolean }) => {

    const { 
        tag, 
        completedCount, 
        totalCount, 
        backgroundImage,
        isStatistic = true 
    } = props;

    const progress = totalCount > 0 ? (completedCount / totalCount) : 0;
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    let strokeDashoffset = circumference - (progress * circumference) + 10;
    // strokeDashoffset = 20

    return (
        <View style={[styles.container, progress == 1 && isStatistic && styles.completeShadow]}>
            <View style={styles.imageContainer}>
                <Image source={backgroundImage} style={styles.tagImage}/>
                {isStatistic}

                { isStatistic &&
                    <View style={styles.progressRingContainer}>
                        <Svg width={radius*2} height={radius*2}>
                            <G rotation="-90" origin={`${radius}, ${radius}`}>
                                <Circle
                                    cx={radius}
                                    cy={radius}
                                    r={radius - 3}
                                    stroke="#e0e0e0"
                                    strokeWidth={3}
                                    fill="transparent"
                                />
                                <Circle
                                    cx={radius}
                                    cy={radius}
                                    r={radius - 3}
                                    stroke="#4CAF50"
                                    strokeWidth={3}
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            </G>
                        </Svg>
                    </View>
                }
            </View>
            <View style={styles.statistics}>
                <Text style={styles.tag}>
                    {tag}
                </Text>
                {isStatistic && <Text style={styles.countText}>
                    {completedCount}/{totalCount}
                </Text>}
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
    },
    completeShadow: {
        shadowColor: 'green',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 20,
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
        overflow: 'hidden',
        position: 'relative'
    },
    progressRingContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 15,
        padding: 3,
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