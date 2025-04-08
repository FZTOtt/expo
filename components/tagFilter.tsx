import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { setTag } from "@/redux/translated";
import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

const TagFilter = () => {
    const { tags } = useAppSelector((state: RootState) => state.translated);
    const dispatch = useAppDispatch()

    const handleResetTags = () => {
        dispatch(setTag(''))
    }
    return (
        <View style={styles.filterButton}>
        { tags!=='' &&
        <TouchableOpacity onPress={handleResetTags}>
            <Text style={styles.filterText}>
                Сбросить фильтры
            </Text>
        </TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({
    filterButton: {
        position: 'absolute',
        top: '10%',
        right: '10%'
    },
    filterText: {
        fontSize: 20,
        color: 'blue'
    }
})

export default TagFilter