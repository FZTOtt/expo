import { TagStatisticProps } from "@/interfaces/tagStatisticProps";
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import GridTable from "./gridTable";
import { router } from "expo-router";
import TagStatistic from "./tagStatistic";
import { useAppDispatch } from "@/hooks";
import { setTag } from "@/redux/translated";

interface ThemesProps {
    tags: TagStatisticProps[];
    isStatistic: boolean;
}


const Themes = ({tags, isStatistic}: ThemesProps) => {
    const dispatch = useAppDispatch()
    return (
        <>
            {tags &&
                <GridTable
                    data={tags}
                    renderItem={( tag ) => {
                        const cleanTag = tag.tag.replace(/^"(.*)"$/, '$1');

                        return (
                            <TouchableOpacity 
                            onPress={() => router.push({ pathname: "/statistic/[tag]", params: { tag: cleanTag } })}
                                // onPress={() => {
                                //     dispatch(setTag(cleanTag))
                                //     router.navigate('/')
                                // }}
                                style={styles.tagWrapper}
                            >
                                <TagStatistic tag={cleanTag} completedCount={tag.completedCount} 
                                totalCount={tag.totalCount} backgroundImage={tag.backgroundImage} isStatistic={isStatistic}/>
                            </TouchableOpacity>
                        )
                    }}
                    maxColumns={10}
                    itemSpacing={10}
                />
            }
        </>
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

export default Themes;