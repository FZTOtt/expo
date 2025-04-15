import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackButton from '@/components/backButton';
import GridTable from '@/components/gridTable';
import WordStatistic from '@/components/wordStatistic';
import WordStatisticProps from '@/interfaces/wordStatisticProps';
import { useEffect, useState } from 'react';
import { getWordStat, getWordsWithTags } from '@/api/api';
import { useAppDispatch } from '@/hooks';
import { setTag } from '@/redux/translated';

const words1: WordStatisticProps[] = [
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
    {
        word: 'aa',
        accuracy: 10
    },
]

interface TagWordInterface {
    link: string,
    tags: string,
    transcription: string,
    word: string,
    word_id: number
}

export default function TagStatisticPage() {
    const { tag } = useLocalSearchParams();

    const [words, setWords] = useState<WordStatisticProps[]>()

    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('MOUNTED Component tags');
        return () => console.log('UNMOUNTED Component tags');
        }, []);

    useEffect(() => {

        const getWordStatistic = async (id: number) => {
            try {
                const [status, response] = await getWordStat(id)
                console.log(status, response)
                return response
            } catch (error) {
                console.log('get stat error', error)
            }
        }

        const fetchTagWords = async () => {
            
            if (typeof tag === 'string') {
                try {
                    const [status, response] = await getWordsWithTags(tag);
                    console.log(status, response)
                    const parsedWords = await Promise.all(
                        response.map(async (word: TagWordInterface) => {
                            const stat = await getWordStatistic(word.word_id);
                            const accuracy = stat 
                                ? (stat.plus ?
                                    stat.minus ?
                                        Math.round(stat.plus / (stat.minus + stat.plus) * 100)
                                        :
                                        0
                                    :
                                    0
                                )
                                : 0;
                            
                            return {
                                word: word.word,
                                accuracy: accuracy
                            };
                        })
                    );
                    console.log('статистика', parsedWords)
                    setWords(parsedWords)
                } catch(error){
                    console.log('error fetch rag words', error)
                }
            }
        };
        fetchTagWords();
    }, [tag]);

    const handleContinueWithTag = () => {
        if (typeof tag === 'string') {
            dispatch(setTag(tag))
            router.navigate('/')
        }
    }

    return (
        <View style={styles.container}>
            <BackButton></BackButton>
            
            <TouchableOpacity  onPress={handleContinueWithTag}>
                <Text style={styles.continue}> Продолжить с данным тегом </Text>
            </TouchableOpacity>
            <View>
                <Text style={styles.headerInformation}>Тег: {tag}</Text>
                { words &&
                    <GridTable
                        data={words}
                        renderItem={({ word, accuracy }) => (
                            <WordStatistic word={word} accuracy={accuracy} />
                        )}
                        maxColumns={4}
                        itemSpacing={10}
                    />}
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    },
    headerInformation: {
        padding: 10,
        fontSize: 18
    },
    continue: {
        padding: 20,
        color: 'blue'
    }
})