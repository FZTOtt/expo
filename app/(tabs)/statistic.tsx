import BackButton from "@/components/backButton";
import GridTable from "@/components/gridTable";
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

    // const { width: screenWidth } = useWindowDimensions();

    // const getNumColumns = useCallback(() => {
    //     if (Platform.OS === 'web') {
    //       if (screenWidth > 1024) return 4;
    //       if (screenWidth > 768) return 3;
    //       return 2;
    //     }
    //     return screenWidth > 600 ? 3 : 2;
    //   }, [screenWidth]);

    // const numColumns = useMemo(getNumColumns, [getNumColumns]);

    // const renderItem = ({ item }: { item: { tag: string} }) => {

    //     return (
    //         <TouchableOpacity style={[styles.tagWrapper,
    //             { width: `${100 / numColumns}%` as `${number}%` }                
    //         ]}
    //         onPress={() => router.push({
    //             pathname: "/statistic/[tag]",
    //             params: { tag: item.tag }
    //           })}>
    //             <TagStatistic tag={item.tag} />
    //         </TouchableOpacity>
    //     );
    // };

    // return (
    //     <View>
    //         <BackButton/>
    //         {/* <View style={styles.tagsGrid}>
    //             <TagStatistic tag='Автомобили' accuracy={58}></TagStatistic>
    //             {tags.map((tag, index) => (

    //                 <TagStatistic 
    //                     // key={index},
    //                     tag={tag.tag}
    //                 />
    //             ))}
    //         </View> */}
    //         <FlatList
    //             key={numColumns}
    //             data={tags}
    //             renderItem={renderItem}
    //             keyExtractor={(item, index) => index.toString()}
    //             numColumns={numColumns}
    //             contentContainerStyle={styles.listContent}
    //             columnWrapperStyle={styles.columnWrapper}
    //         />
    //     </View>
    // )
    return (
        <View style={styles.container}>
            <BackButton/>
        
            <GridTable
                data={tags}
                renderItem={({ tag }) => (
                <TouchableOpacity 
                    onPress={() => router.push({ pathname: "/statistic/[tag]", params: { tag } })}
                    style={styles.tagWrapper}
                >
                    <TagStatistic tag={tag} />
                </TouchableOpacity>
                )}
                maxColumns={4}
                itemSpacing={10}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    listContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'flex-start',
    },
    tagWrapper: {
        padding: 8
    },
    emptyItem: {
        opacity: 0,
    }
});

export default Statistic;
