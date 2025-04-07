import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackButton from '@/components/backButton';
import GridTable from '@/components/gridTable';
import WordStatistic from '@/components/wordStatistic';
import WordStatisticProps from '@/interfaces/wordStatisticProps';

const words: WordStatisticProps[] = [
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

export default function TagStatisticPage() {
    const { tag } = useLocalSearchParams();
    
    return (
        <View style={styles.container}>
            <BackButton></BackButton>
            <View>
                <Text style={styles.headerInformation}>Тег: {tag}</Text>
                <GridTable
                    data={words}
                    renderItem={({ word, accuracy }) => (
                        <WordStatistic word={word} accuracy={accuracy} />
                    )}
                    maxColumns={4}
                    itemSpacing={10}
                />
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
    }
})