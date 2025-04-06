import TagStatistic from "@/components/tagStatistic";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Platform, useWindowDimensions } from "react-native";

const tags: TagStatisticProps[] = [
    {
        tag: 'Автомобили1',
    },
    {
        tag: 'Квартира',
    },
    {
        tag: 'Дом',
    },
    {
        tag: 'Погода',
    },
    {
        tag: 'Улица',
    },
    {
        tag: 'Интерьер',
    },
    {
        tag: 'Метро',
    },
    {
        tag: 'Автомобили2',
    },
    {
        tag: 'Квартира',
    },
    {
        tag: 'Дом',
    },
    {
        tag: 'Погода',
    },
    {
        tag: 'Улица',
    },
    {
        tag: 'Интерьер',
    },
    {
        tag: 'Метро',
    },
    {
        tag: 'Автомобили3',
    },
    {
        tag: 'Квартира',
    },
    {
        tag: 'Дом',
    },
    {
        tag: 'Погода',
    },
    {
        tag: 'Улица',
    },
    {
        tag: 'Интерьер',
    },
    {
        tag: 'Метро',
    },
    {
        tag: 'Автомобили4',
    },
    {
        tag: 'Квартира',
    },
    {
        tag: 'Дом',
    },
    {
        tag: 'Погода',
    },
    {
        tag: 'Улица',
    },
    {
        tag: 'Интерьер',
    },
    {
        tag: 'Метро',
    },
    {
        tag: 'Автомобили5',
    },
    {
        tag: 'Квартира',
    },
    {
        tag: 'Дом',
    },
    {
        tag: 'Погода',
    },
    {
        tag: 'Улица',
    },
    {
        tag: 'Интерьер',
    },
    {
        tag: 'Метро',
    },
]

const Statistic = () => {

    const { width: screenWidth } = useWindowDimensions();

    const getNumColumns = useCallback(() => {
        if (Platform.OS === 'web') {
          if (screenWidth > 1024) return 4;
          if (screenWidth > 768) return 3;
          return 2;
        }
        return screenWidth > 600 ? 3 : 2;
      }, [screenWidth]);

    const numColumns = useMemo(getNumColumns, [getNumColumns]);

    const renderItem = ({ item }: { item: { tag: string} }) => {

        return (
            <View style={[styles.tagWrapper,
                { width: `${100 / numColumns}%` as `${number}%` }
            ]}>
                <TagStatistic tag={item.tag} />
            </View>
        );
    };

    return (
        <View>
            <TouchableOpacity onPress={() => router.back()}>
                <Text>← Назад</Text>
            </TouchableOpacity>
            {/* <View style={styles.tagsGrid}>
                <TagStatistic tag='Автомобили' accuracy={58}></TagStatistic>
                {tags.map((tag, index) => (

                    <TagStatistic 
                        // key={index},
                        tag={tag.tag}
                    />
                ))}
            </View> */}
            <FlatList
                key={numColumns}
                data={tags}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    )
}

// const styles = StyleSheet.create({
//     tagsGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//         padding: 40,
//         gap: 10,
//     },
// })

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 10,
        // padding: 20
    },
    listContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'flex-start',
    },
    tagWrapper: {
        // flex: 1,
        // width: `${100 / numColumns}%`,
        padding: 8
    },
    emptyItem: {
        opacity: 0,
    }
});

export default Statistic;
