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
]

const ThemesPage = () => {

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
                const parsedTags = response.topics.map( (topic: any) => {
                    // console.log(topic)
                    // const pasrName = topic.topic.split(' ')
                    // tag: pasrName[1].replace(/\)/g, '')
                    return { tag: topic.topic,
                        completedCount: topic.true_words,
                        totalCount: topic.all_words,
                        backgroundImage: exampleTag
                    }
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
            <Themes tags={tags} isStatistic={false}/>
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

export default ThemesPage;
