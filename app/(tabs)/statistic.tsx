import { getAllTags } from "@/api/api";
import BackButton from "@/components/backButton";
import GridTable from "@/components/gridTable";
import TagStatistic from "@/components/tagStatistic";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Platform, useWindowDimensions } from "react-native";

const tags1: TagStatisticProps[] = [
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

    const [tags, setTags] = useState<TagStatisticProps[]>()

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const [status, response] = await getAllTags();
                console.log(status, response)
                const parsedTags = response.tags.map( (tag: string) => {
                    const pasrName = tag.split(',')
                    return { tag: pasrName[1].replace(/\)/g, '')}
                })
                console.log(parsedTags)
                setTags(parsedTags)
            } catch(error) {
                console.log('error fetch tags', error)
            }
        }
        
        fetchTags()
    }, [])

    return (
        <View style={styles.container}>
            <BackButton/>
            {tags &&
                <GridTable
                    data={tags}
                    renderItem={({ tag }) => {
                        const cleanTag = tag.replace(/^"(.*)"$/, '$1');

                        return (
                            <TouchableOpacity 
                                onPress={() => router.push({ pathname: "/statistic/[tag]", params: { tag: cleanTag } })}
                                style={styles.tagWrapper}
                            >
                                <TagStatistic tag={cleanTag} />
                            </TouchableOpacity>
                        )
                    }}
                    maxColumns={4}
                    itemSpacing={10}
                />
            }
            
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
