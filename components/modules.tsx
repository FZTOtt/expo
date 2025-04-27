import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import Button from "./button";

type Module = {
    id: string;
    title: string;
}

const Modules = () => {

    const [modules, setModules] = useState<Module[]>([]);

    useEffect(() => {
        const refModules: Module[] = [
            {
                id: '1',
                title: 'Введение'
            },
            {
                id: '2',
                title: 'Кафе'
            },
            {
                id: '3',
                title: 'Улица'
            },
            {
                id: '4',
                title: 'Учеба'
            },
            {
                id: '5',
                title: 'Работа'
            },
        ]
        setModules(refModules)
    }, [])

    const renderModule = ({ item }: { item: Module }) => (
        <Button mode="modules">
            Модуль {item.id}. {item.title}
        </Button>
    );

    return (
        <View style={styles.container}>
            <FlatList 
            data={modules}
            renderItem={renderModule}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: 'rgba(82, 101, 109, 1)',
        borderBottomWidth: 2,
        height: '50%',
        paddingTop: 60,
        paddingHorizontal: '5%'
    },
})

export default Modules;