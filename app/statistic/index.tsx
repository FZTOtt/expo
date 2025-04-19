import { getAllTags } from "@/api/api";
import BackButton from "@/components/backButton";
import GridTable from "@/components/gridTable";
import TagStatistic from "@/components/tagStatistic";
import { TagStatisticProps } from "@/interfaces/tagStatisticProps";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import ecampleTag from '@/assets/images/exampleTag.jpg';

const tags1: TagStatisticProps[] = [
    {
        tag: 'Автомобasdasdas b fdsfsdffd asdasda',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Автомобили2',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Автомобили3',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Автомобили4',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Автомобили5',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: ecampleTag,
    },
]

const StatisticPage = () => {

    const [tags, setTags] = useState<TagStatisticProps[]>()

    useEffect(() => {
        console.log('MOUNTED Component Statistic');
        return () => console.log('UNMOUNTED Component Statistic');
        }, []);

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
                    data={tags1}
                    renderItem={( tag ) => {
                        const cleanTag = tag.tag.replace(/^"(.*)"$/, '$1');

                        return (
                            <TouchableOpacity 
                                onPress={() => router.push({ pathname: "/statistic/[tag]", params: { tag: cleanTag } })}
                                style={styles.tagWrapper}
                            >
                                <TagStatistic tag={cleanTag} completedCount={tag.completedCount} 
                                totalCount={tag.totalCount} backgroundImage={tag.backgroundImage}/>
                            </TouchableOpacity>
                        )
                    }}
                    maxColumns={10}
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

export default StatisticPage;
