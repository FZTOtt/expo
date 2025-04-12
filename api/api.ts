import { Platform } from "react-native";
import { postRequest, getRequest } from "./ajax";

const API_BASE_URL = "https://ouzistudy.ru/api";
// localhost:8080

export const translateAudio = async (audioData: string | Blob): Promise<[number, any]> => {
    const formData = new FormData();
    
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
    console.log(`[API] Запрос подсказки для фонемы: "${phoneme}"`);
    const data = JSON.stringify({ phonema: phoneme})
    
    await new Promise(resolve => setTimeout(resolve, 300));

    if (phoneme === 'p') {
        return postRequest(`${API_BASE_URL}/tip/get_tip`, data)
    }

    return [200, {
            phonema: `${phoneme}`,
            tipText: 'adsfaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffadsfaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffadsfaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffadsfaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffadsfaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffadsfaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffadsfaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffadsfaaaaadaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            tipAudio: '',
            tipPicture: ''
    }]
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
    const data = JSON.stringify({ tag: tags })

    return postRequest(`${API_BASE_URL}/word/rand/word`, data, headers)
}

/*
    Запрос на получение всех тегов
*/
export const getAllTags = async () => {

    return getRequest(`${API_BASE_URL}/word/get_tags`)
}

/*
    Запрос на получение всех слов с тегом
*/
export const getWordsWithTags = async (tag: string): Promise<[number, any]> => {

    const data = JSON.stringify({ tag: tag })

    return postRequest(`${API_BASE_URL}/word/words_with_tag`, data)
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
