import { useEffect, useState } from "react"
import WordPronounce from "./wordPronounce"
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import WordGuess from "./wordGuess";
import { getCurrentWordModule, getWordModuleExercises } from "@/api/api";
import { useExerciseParser } from "@/hooks/exerciseParser";
import PronounceFiew from "./pronounceFiew";
import { nextWordExercise, setCurrentWordModule } from "@/redux/module";
import { Animated, StyleSheet, View, Text, Modal } from "react-native";

const ExerciseWordBlock = () => {
    const dispatch = useAppDispatch()
    const { parseWordExercise } = useExerciseParser();
    const { wordExercise } = useAppSelector((state: RootState) => state.exercise);
    const { currentWordModuleId, currentWordExerciseIndex, wordExercises } = useAppSelector((state: RootState) => state.module);

    const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для модального окна
    const [fadeAnim] = useState(new Animated.Value(0)); // Анимация для модального окна


    // запрашиваем упражнение для слова, 
    // парсим, устанавливаем тип упражнения и используем сооветствующие компоненты
    useEffect(() => {
        if (currentWordModuleId) return
        const init = async () => {
            const [status1, currentModule] = await getCurrentWordModule();
            if (status1 === 200) {
              const [status2, response] = await getWordModuleExercises(currentModule.module_id);
              if (status2 === 200) {
                dispatch(setCurrentWordModule({
                    id: currentModule.module_id,
                    exercises: response.exercises}));
                parseWordExercise(response.exercises[0]); // первый — текущий
              }
            }
          };
        
          init();
    }, [])

    function handleNextExercise() {
        const nextIndex = currentWordExerciseIndex + 1;

        if (nextIndex < wordExercises.length) {
            dispatch(nextWordExercise());
            parseWordExercise(wordExercises[nextIndex]);
        } else {
            // Конец модуля
            console.log("Модуль завершён");
            const getNextModule = async () => {
                let [status, response] = await getWordModuleExercises(currentWordModuleId+1);
                if (status === 200) {
                    if (response.exercises.length != 0) {
                        dispatch(setCurrentWordModule({
                            id: currentWordModuleId+1,
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
            }
            getNextModule()
        }
    }

    const handleTaskComplete = () => {
        setIsModalVisible(true);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setIsModalVisible(false);
                handleNextExercise();
            });
        }, 2000);
    };
    
    return (
        <>
            <Modal transparent visible={isModalVisible} animationType="none">
                    <View style={styles.modalContainer}>
                        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                            <Text style={styles.modalText}>Переходим к следующему заданию...</Text>
                        </Animated.View>
                    </View>
            </Modal>

            {wordExercise === 'pronounce' && <WordPronounce handleNext={handleTaskComplete}/>}
            {wordExercise === 'guessWord' && <WordGuess handleNext={handleTaskComplete}/>}
            {wordExercise === 'pronounceFiew' && <PronounceFiew handleNext={handleTaskComplete}/>}
        </>
        
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "rgba(32,47,54,1.00)",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
});

export default ExerciseWordBlock;

