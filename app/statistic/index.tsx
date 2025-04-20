import { getAllTags } from "@/api/api";
import BackButton from "@/components/backButton";
import { TagStatisticProps } from "@/interfaces/tagStatisticProps";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import exampleTag from '@/assets/images/exampleTag.jpg';
import Themes from "@/components/themes";

const tags1: TagStatisticProps[] = [
    {
        tag: 'Автомобasdasdas b fdsfsdffd asdasda',
        completedCount: 30,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 20,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 0,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 15,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Автомобили2',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Автомобили3',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Автомобили4',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Автомобили5',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Квартира',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Дом',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Погода',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Улица',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Интерьер',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
    {
        tag: 'Метро',
        completedCount: 10,
        totalCount: 30,
        backgroundImage: exampleTag,
    },
]

const StatisticPage = () => {

    const [tags, setTags] = useState<TagStatisticProps[]>([])

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
            <Themes tags={tags} isStatistic={true}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1
    },
    tagWrapper: {
        padding: 8
    },
});

export default StatisticPage;
