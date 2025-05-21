import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useExerciseParser } from "@/hooks/exerciseParser"
import { RootState } from "@/redux/store"
import PhrasePronounce from "./phrasePronounce"
import CompleteChain from "./completeChain"
import { getCurrentPhraseModule, getPhraseModuleExercises, sendExerciseProgress } from "@/api/api"
import { nextPhraseExercise, setCurrentPhraseModule } from "@/redux/module"
import { View, StyleSheet, Animated, Modal, Text } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"

const ExercisePhrasesBlock = () => {

    const dispatch = useAppDispatch();
    const { parsePhrasesExercise } = useExerciseParser();
    const { phraseExercise } = useAppSelector((state: RootState) => state.exercise);
    const { currentPhraseModuleId, currentPhraseExerciseIndex, phraseExercises } = useAppSelector((state: RootState) => state.module);
    const { id } = useAppSelector((state: RootState) => state.phrases);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));


    // запрашиваем упражнение для слова, после его парсинга отрисовываем соответствующие
    useEffect(() => {
        if (currentPhraseModuleId) return
        const init = async () => {
            const token = await AsyncStorage.getItem('userToken');
            const [status1, currentModule] = await getCurrentPhraseModule(token);
            if (status1 === 200) {
              const [status2, response] = await getPhraseModuleExercises(currentModule.module_id, token);
              if (status2 === 200) {
                dispatch(setCurrentPhraseModule({
                    id: currentModule.module_id,
                    exercises: response.exercises}));
                parsePhrasesExercise(response.exercises[0]); // первый — текущий
              }
            }
          };
        
          init();
    }, [])

    function handleNextExercise() {

        const nextIndex = currentPhraseExerciseIndex + 1;

        if (nextIndex < phraseExercises.length) {
            dispatch(nextPhraseExercise());
            parsePhrasesExercise(phraseExercises[nextIndex]);
        } else {
            // Конец модуля
            // console.log("Модуль завершён");
            if (currentPhraseModuleId === null) return
            const getNextModule = async () => {
                const token = await AsyncStorage.getItem('userToken');
                let [status, response] = await getPhraseModuleExercises(currentPhraseModuleId+1, token);
                if (status === 200) {
                    if (response.exercises.length != 0) {
                        dispatch(setCurrentPhraseModule({
                            id: currentPhraseModuleId+1,
                            exercises: response.exercises}));
                        parsePhrasesExercise(response.exercises[0]);
                    } else {
                        [status, response] = await getPhraseModuleExercises(1, token);
                        if (status === 200) {
                            dispatch(setCurrentPhraseModule({
                                id: 1,
                                exercises: response.exercises}));
                                parsePhrasesExercise(response.exercises[0]);
                        } 
                    } 
                }
            }
            getNextModule()
        }
    }

    const handleTaskComplete = (correct: boolean) => {
        setIsModalVisible(true);

        const sendResult = async () => {
            if (id === null) return
            const token = await AsyncStorage.getItem('userToken');
            const [status, response] = await sendExerciseProgress(id, 'phrase', correct ? 'completed' : 'failed', token)
            // if (status === 200) {
            //     console.log('результат записан')
            // } else {
            //     console.error('ошибка при записи статистики')
            // }
        }
        sendResult()

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
        <View style={styles.mainContainer}>
            <Modal transparent visible={isModalVisible} animationType="none">
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                        <Text style={styles.modalText}>Переходим к следующему заданию...</Text>
                    </Animated.View>
                </View>
            </Modal>
            {phraseExercise === 'pronounce' && <PhrasePronounce handleNext={handleTaskComplete}/>}
            {phraseExercise === 'completeChain' && <CompleteChain handleNext={handleTaskComplete}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        borderRightWidth: 2,
        borderColor: 'rgba(82, 101, 109, 1)',
        paddingTop: 50,
        paddingBottom: 50,
        minWidth: 700
    },
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
})

export default ExercisePhrasesBlock;