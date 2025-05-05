import { useEffect } from "react"
import WordPronounce from "./wordPronounce"
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import WordGuess from "./wordGuess";
import { getCurrentWordModule, getWordExercise, getWordModuleExercises } from "@/api/api";
import { useExerciseParser } from "@/hooks/exerciseParser";
import PronounceFiew from "./pronounceFiew";
import { nextWordExercise, setCurrentWordModule } from "@/redux/module";

const ExerciseWordBlock = () => {
    const dispatch = useAppDispatch()
    const { parseWordExercise } = useExerciseParser();
    const { wordExercise } = useAppSelector((state: RootState) => state.exercise);
    const { currentWordModuleId, currentWordExerciseIndex, wordExercises } = useAppSelector((state: RootState) => state.module);

    // запрашиваем упражнение для слова, 
    // парсим, устанавливаем тип упражнения и используем сооветствующие компоненты
    useEffect(() => {
        if (currentWordModuleId) return
        const init = async () => {
            const [status1, currentModule] = await getCurrentWordModule();
            console.log(currentModule)
            if (status1 === 200) {
              const [status2, response] = await getWordModuleExercises(currentModule.module_id);
              console.log(response)
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
            // Можно вызвать переход к следующему модулю или показать экран с результатами
        }
    }
    
    return (
        <>
            {wordExercise === 'pronounce' && <WordPronounce handleNext={handleNextExercise}/>}
            {wordExercise === 'guessWord' && <WordGuess handleNext={handleNextExercise}/>}
            {wordExercise === 'pronounceFiew' && <PronounceFiew handleNext={handleNextExercise}/>}
        </>
        
    )
}



export default ExerciseWordBlock;

