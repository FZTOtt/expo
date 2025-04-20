import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { setTag } from "@/redux/translated";
import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from "react-native";

const TagFilter = () => {
    const { tags } = useAppSelector((state: RootState) => state.translated);
    const dispatch = useAppDispatch()

    // const handleResetTags = () => {
    //     dispatch(setTag(''))
    // }

    const [isVisible, setIsVisible] = React.useState(false);
    const [selectedTag, setSelectedTag] = React.useState('');
    const [allTags, setAllTags] = React.useState<string[]>([])

    const [modalVisible, setModalVisible] = React.useState(false);

    const toggleDropdown = () => setIsVisible(!isVisible);

    const handleSelectTag = (tag: string) => {
        setSelectedTag(tag);
        dispatch(setTag(tag));
        setIsVisible(false);
    };

    const handleReset = () => {
        setSelectedTag('');
        dispatch(setTag(''));
    };
    React.useEffect(() => {

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

            {/* {selectedTag ? (
                <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                    <Text style={styles.resetText}>×</Text>
                </TouchableOpacity>
            ) : null} */}
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