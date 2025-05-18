import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import Button from "./button";
import { usePathname } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { getPhraseModuleExercises, getPhraseModules, getWordModuleExercises, getWordModules } from "@/api/api";
import { setCurrentPhraseModule, setCurrentWordModule } from "@/redux/module";
import { useExerciseParser } from "@/hooks/exerciseParser";

type Module = {
    id: number;
    title: string;
}

const Modules = () => {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { parseWordExercise, parsePhrasesExercise } = useExerciseParser()
    const { currentPhraseModuleId, currentWordModuleId } = useAppSelector((state: RootState) => state.module);

    const [modules, setModules] = useState<Module[]>([]);

    useEffect(() => {
        let refModules: Module[] = [
            // {
            //     id: '1',
            //     title: 'Введение'
            // },
            // {
            //     id: '2',
            //     title: 'Кафе'
            // },
            // {
            //     id: '3',
            //     title: 'Улица'
            // },
            // {
            //     id: '4',
            //     title: 'Учеба'
            // },
            // {
            //     id: '5',
            //     title: 'Работа'
            // },
        ]
        const getModules = async (path: string) => {
            if (path == '/') {
                const [status, response] = await getWordModules()
                if (status == 200) {
                    refModules = response.modules.map((mod : Module) => (
                        {
                            id: mod.id,
                            title: mod.title 
                        }
                    ))
                }
            } else {
                const [status, response] = await getPhraseModules()
                if (status == 200) {
                    refModules = response.modules.map((mod : Module) => (
                        {
                            id: mod.id,
                            title: mod.title 
                        }
                    ))
                }     
            }
            setModules(refModules)
        }
        getModules(pathname)
    }, [])

    async function handleModuleSelect(id: number) {
        if (pathname == '/') {
            let [status, response] = await getWordModuleExercises(id);
            if (status === 200) {
                if (response.exercises.length != 0) {
                    dispatch(setCurrentWordModule({
                        id: id,
                        exercises: response.exercises}));
                    parseWordExercise(response.exercises[0]);
                } else {
                    [status, response] = await getWordModuleExercises(1);
                    if (status === 200) {
                        dispatch(setCurrentWordModule({
                            id: 1,
                            exercises: response.exercises}));
                        parseWordExercise(response.exercises[0]);
                    } 
                } 
            }
        } else {
            let [status, response] = await getPhraseModuleExercises(id);
            if (status === 200) {
                if (response.exercises.length != 0) {
                    dispatch(setCurrentPhraseModule({
                        id: id,
                        exercises: response.exercises}));
                    parsePhrasesExercise(response.exercises[0]);
                } else {
                    [status, response] = await getPhraseModuleExercises(1);
                    if (status === 200) {
                        dispatch(setCurrentPhraseModule({
                            id: 1,
                            exercises: response.exercises}));
                        parsePhrasesExercise(response.exercises[0]);
                    } 
                } 
            }
        }
    }

    const renderModule = ({ item }: { item: Module }) => (
        <Button mode="modules" active={pathname == '/' ? item.id == currentWordModuleId : item.id == currentPhraseModuleId} onClick={() => handleModuleSelect(item.id)}>
            Модуль {item.id}. {item.title}
        </Button>
    );

    return (
        <View style={styles.container}>
            <FlatList 
            data={modules}
            renderItem={renderModule}
            keyExtractor={(item : Module) => item.id.toString()}
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