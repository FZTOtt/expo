import { Platform } from "react-native";
import { postRequest, getRequest } from "./ajax";

const API_BASE_URL = "https://ouzistudy.ru/api";
// localhost:8080

/*
    Запрос для распознавания аудио
*/
// export const translateAudio = async (audioBlob: Blob | any): Promise<[number, any]> => {
//     const formData = new FormData();
//     formData.append("file", audioBlob, "recording.wav");
//     console.log('FormData content:', formData.get('file'));
//     const headers = {
//         // "Content-Type": "audio/wav",
//     }
  
//     return postRequest(`${API_BASE_URL}/audio/translate_audio`, formData, headers);
// };

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
    Запрос на слово
*/
export const getWord = async(word:string): Promise<[number, any]> => {

    return getRequest(`${API_BASE_URL}/word/${word}`)
}

export const getRandomWord = async (tags: string): Promise<[number, any]> => {

    const headers = {
        // "Content-Type": "application/json",
    }
    const data = JSON.stringify({ tags: tags })

    return postRequest(`${API_BASE_URL}/word/rand_word`, data, headers)
}

export const getAllTags = async () => {

    return getRequest(`${API_BASE_URL}/word/get_tags`)
}

export const getWordsWithTags = async (tag: string): Promise<[number, any]> => {

    const data = JSON.stringify({ tag: tag })

    return postRequest(`${API_BASE_URL}/word/words_with_tag`, data)
}

export const getWordStat = async (wordId: number): Promise<[number, any]> => {

    return getRequest(`${API_BASE_URL}/word/stat/get_stat/${wordId}`)
}

export const writeStat = async (reqData: {"id": number, "plus": number, "minus": number}): Promise<[number, any]> => {

    const data = JSON.stringify(reqData)

    return postRequest(`${API_BASE_URL}/word/stat/write_stat`, data)
}