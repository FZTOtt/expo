import { Platform } from "react-native";
import { postRequest, getRequest } from "./ajax";
import { PhrasesExerciseApiResponse, WordExerciseApiResponse } from "@/interfaces/apiResponses";

const API_BASE_URL = "https://ouzistudy.ru/api";
// localhost:8080

export const translateAudio = async (audioData: string | Blob, word: string): Promise<[number, any]> => {
    const formData = new FormData();
    
    formData.append('word', word);
    
    if (typeof audioData === 'string') {
        const filename = audioData.split('/').pop() || 'audio.wav';
        formData.append('file', {
            uri: audioData,
            name: filename,
            type: 'audio/wav'
        } as any);
    } else {
        formData.append('file', audioData, 'audio.wav');
    }
    const headers: Record<string, string> = Platform.OS === 'web' ? {} : {
        'Content-Type': 'multipart/form-data'
    };
    
    return postRequest(`${API_BASE_URL}/audio/translate_audio`, formData, headers);
};

/*
    Запрос на получение подсказки по фонеме
*/
export const getPhonemeReference = async (phoneme: string): Promise<[number, any]> => {
    const data = JSON.stringify({ phonema: phoneme})
    
    return postRequest(`${API_BASE_URL}/tip/get_tip`, data)

}

/*
Запрос на слово
*/
export const getWord = async(word:string): Promise<[number, any]> => {

    return getRequest(`${API_BASE_URL}/word/${word}`)
}

/* 
    Запрос на случайное слово с тегом
*/
export const getRandomWord = async (tags: string): Promise<[number, any]> => {

    const headers = {
        // "Content-Type": "application/json",
    }
    const data = JSON.stringify({ topic: tags })

    return postRequest(`${API_BASE_URL}/word/rand/word`, data, headers)
}

/*
    Запрос на получение всех тегов
*/
export const getAllTags = async () => {

    return getRequest(`${API_BASE_URL}/topic/all_topics`)
}

/*
    Запрос на получение всех слов с тегом
*/
export const getWordsWithTags = async (tag: string): Promise<[number, any]> => {

    const data = JSON.stringify({ topic: tag })

    return postRequest(`${API_BASE_URL}/word/words_with_topic`, data)
}

/* 
    Запрос на статистику слова
*/
export const getWordStat = async (wordId: number): Promise<[number, any]> => {

    return getRequest(`${API_BASE_URL}/word/stat/get_stat/${wordId}`)
}

/*
    Запрос на запись статистики слова
*/
export const writeStat = async (reqData: {"id": number, "plus": number, "minus": number}): Promise<[number, any]> => {

    const data = JSON.stringify(reqData)

    return postRequest(`${API_BASE_URL}/word/stat/write_stat`, data)
}

export const getPhoneme = async (): Promise<[number, any]> => {

    return getRequest(`http://localhost:3001/node/random_phoneme`)
}

export const getWordNode = async (): Promise<[number, any]> => {

    return getRequest(`http://localhost:3001/word/random`)
}

export const getWordExercise = async (module: string): Promise<[number, WordExerciseApiResponse]> => {

    const data = JSON.stringify({ module: module })

    return postRequest(`${API_BASE_URL}/getExrcise/word`, data)
}

export const getPhraseExercise = async (module: string): Promise<[number, PhrasesExerciseApiResponse]> => {

    const data = JSON.stringify({ module: module })

    return postRequest(`${API_BASE_URL}/getExrcise/phrase`, data)
}