import { getAllTags } from "@/api/api";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { setReloadTargetWord, setTag } from "@/redux/translated";
import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from "react-native";

const TagFilter = () => {
    const { tags } = useAppSelector((state: RootState) => state.translated);
    const dispatch = useAppDispatch()

    const [isVisible, setIsVisible] = React.useState(false);
    const [allTags, setAllTags] = React.useState<string[]>([])

    const toggleDropdown = () => setIsVisible(!isVisible);

    const handleSelectTag = (tag: string) => {
        dispatch(setTag(tag));
        dispatch(setReloadTargetWord(null));
        setIsVisible(false);
    };

    React.useEffect(() => {
        const getTags = async () => {
            const [status, response] = await getAllTags()
            if (status === 200) {
                const allTopics = response.topics.map((topic: any) => {
                    return topic.topic
                })
                setAllTags(allTopics)
            } else {
                console.log('Error fetch all tags in tagFilter')
            }
            
        } 

        getTags()
    }, [])

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownHeader}>
                <Text style={styles.headerText}>
                    {tags || 'Выбор Темы'}
                </Text>
            </TouchableOpacity>

            {isVisible && (
                <View style={styles.dropdownList}>
                    <FlatList
                        data={['Сбросить тему', ...allTags]}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.item} 
                                onPress={() => {
                                    if (item === 'Сбросить тему') {
                                        handleSelectTag('');
                                        // dispatch(setReloadTargetWord(null));
                                    } else {
                                        handleSelectTag(item);
                                    }
                                }}
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                        nestedScrollEnabled
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '10%',
        left: '5%',
        zIndex: 10,
    },
    dropdownHeader: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        minWidth: 150,
    },
    headerText: {
        fontSize: 16,
    },
    dropdownList: {
        position: 'absolute',
        top: 45,
        left: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        maxHeight: 200, // Ограничение высоты (примерно 5 элементов)
        width: 200,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    list: {
        flexGrow: 0,
    },
    listContent: {
        paddingVertical: 5,
    },
    item: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    resetButton: {
        position: 'absolute',
        right: -10,
        top: -10,
        backgroundColor: '#ff4444',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TagFilter