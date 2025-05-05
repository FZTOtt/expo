import { useEffect } from "react"
import WordPronounce from "./wordPronounce"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useExerciseParser } from "@/hooks/exerciseParser"
import { RootState } from "@/redux/store"
import { setPhraseExercise } from "@/redux/exercise"
import PhrasePronounce from "./phrasePronounce"
import CompleteChain from "./completeChain"
import { getCurrentPhraseModule, getPhraseModuleExercises } from "@/api/api"
import { nextPhraseExercise, setCurrentPhraseModule } from "@/redux/module"

const ExercisePhrasesBlock = () => {

    const dispatch = useAppDispatch()
    const { parsePhrasesExercise } = useExerciseParser();
    const { phraseExercise } = useAppSelector((state: RootState) => state.exercise);
    const { currentPhraseModuleId, currentPhraseExerciseIndex, phraseExercises } = useAppSelector((state: RootState) => state.module);
    // запрашиваем упражнение для слова, после его парсинга отрисовываем соответствующие
    useEffect(() => {
        if (currentPhraseModuleId) return
        const init = async () => {
            const [status1, currentModule] = await getCurrentPhraseModule();
            console.log(currentModule)
            if (status1 === 200) {
              const [status2, response] = await getPhraseModuleExercises(currentModule.module_id);
              console.log(response)
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
            console.log("Модуль завершён");
            // Можно вызвать переход к следующему модулю или показать экран с результатами
        }
    }
    
    return (
        <>
            {phraseExercise === 'pronounce' && <PhrasePronounce handleNext={handleNextExercise}/>}
            {phraseExercise === 'completeChain' && <CompleteChain handleNext={handleNextExercise}/>}
        </>
    )
}



export default ExercisePhrasesBlock;