import { useEffect } from "react"
import WordPronounce from "./wordPronounce"
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import WordGuess from "./wordGuess";
import { getWordExercise } from "@/api/api";
import { useExerciseParser } from "@/hooks/exerciseParser";
import { setWordExercise } from "@/redux/exercise";
import PronounceFiew from "./pronounceFiew";

const ExerciseWordBlock = () => {
    const dispatch = useAppDispatch()
    const { parseWordExercise } = useExerciseParser();
    const { wordExercise } = useAppSelector((state: RootState) => state.exercise);

    const fetchWordPronounceExercise = async (module: string = '') => {
        
        const [status, response] = await getWordExercise('')
        
        if (status === 200) {
            parseWordExercise(response)
        } else {
            console.error('Ошибка в запросе fetchRandomWord', response);
        }
    }

    // запрашиваем упражнение для слова, 
    // парсим, устанавливаем тип упражнения и используем сооветствующие компоненты
    useEffect(() => {
        // при первом рендере надо установить задание
        if (!wordExercise) {
            console.log('установили задание произношения')
            // fetchWordPronounceExercise()
            dispatch(setWordExercise('pronounceFiew'))
            // dispatch(setWordExercise('pronounce'))
        }
    }, [])
    
    return (
        <>
            {wordExercise === 'pronounce' && <WordPronounce />}
            {wordExercise === 'guessWord' && <WordGuess />}
            {wordExercise === 'pronounceFiew' && <PronounceFiew />}
        </>
        
    )
}



export default ExerciseWordBlock;

