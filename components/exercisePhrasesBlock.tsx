import { useEffect } from "react"
import WordPronounce from "./wordPronounce"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useExerciseParser } from "@/hooks/exerciseParser"
import { RootState } from "@/redux/store"
import { setPhraseExercise } from "@/redux/exercise"
import PhrasePronounce from "./phrasePronounce"
import CompleteChain from "./completeChain"

const ExercisePhrasesBlock = () => {

    const dispatch = useAppDispatch()
    const { parsePhrasesExercise } = useExerciseParser()
    const { phraseExercise } = useAppSelector((state: RootState) => state.exercise)
    // запрашиваем упражнение для слова, после его парсинга отрисовываем соответствующие
    useEffect(() => {
        if (!phraseExercise) {
            dispatch(setPhraseExercise('completeChain'))
        }
    }, [])
    
    return (
        <>
            {phraseExercise === 'pronounce' && <PhrasePronounce />}
            {phraseExercise === 'completeChain' && <CompleteChain />}
        </>
    )
}



export default ExercisePhrasesBlock;