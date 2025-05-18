import { Platform } from "react-native";
import { postRequest, getRequest } from "./ajax";
import { PhrasesExerciseApiResponse, WordExerciseApiResponse } from "@/interfaces/apiResponses";

const API_BASE_URL = "https://ouzistudy.ru/api";
const NODE_API_URL = "http://localhost:3001";
const NODE_API_DEPLOY = "https://ouzistudy.ru";
const CURRENT_API = NODE_API_URL;
// https://ouzistudy.ru

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

export const getCurrentWordModule = async (): Promise<[number, any]> => {

    return getRequest(`${CURRENT_API}/apinode/current-word-module/`)
}

export const getWordModuleExercises = async (id: number): Promise<[number, any]> => {

    return getRequest(`${CURRENT_API}/apinode/word-modules/${id}/exercises`)
}

export const getCurrentPhraseModule = async (): Promise<[number, any]> => {

    return getRequest(`${CURRENT_API}/apinode/current-phrase-module/`)
}

export const getPhraseModuleExercises = async (id: number): Promise<[number, any]> => {

    return getRequest(`${CURRENT_API}/apinode/phrase-modules/${id}/exercises`)
}

export const getWordModules = async (): Promise<[number, any]> => {
CURRENT_API
    return getRequest(`${CURRENT_API}/apinode/word-modules`)
}

export const getPhraseModules = async (): Promise<[number, any]> => {

    return getRequest(`${CURRENT_API}/apinode/phrase-modules`)
}

export const getWordTranscrible = async (audioData: string | Blob): Promise<[number, any]> => {
    const formData = new FormData();
    
    if (typeof audioData === 'string') {
        const filename = audioData.split('/').pop() || 'audio.wav';
        formData.append('audio', {
            uri: audioData,
            name: filename,
            type: 'audio/wav'
        } as any);
    } else {
        formData.append('audio', audioData, 'audio.wav');
    }
    const headers: Record<string, string> = Platform.OS === 'web' ? {} : {
        'Content-Type': 'multipart/form-data'
    };
    
    return postRequest(`${CURRENT_API}/apinode/transcribe-word`, formData, headers);
};

export const getPhraseTranscrible = async (audioData: string | Blob): Promise<[number, any]> => {
    const formData = new FormData();
    
    if (typeof audioData === 'string') {
        const filename = audioData.split('/').pop() || 'audio.wav';
        formData.append('audio', {
            uri: audioData,
            name: filename,
            type: 'audio/wav'
        } as any);
    } else {
        formData.append('audio', audioData, 'audio.wav');
    }
    const headers: Record<string, string> = Platform.OS === 'web' ? {} : {
        'Content-Type': 'multipart/form-data'
    };
    
    return postRequest(`${CURRENT_API}/apinode/transcribe-phrase`, formData, headers);
};

export const getAIHelp = async (target: string, errors: number): Promise<[number, any]> => {

    const data = JSON.stringify({ 
        target: target,
        errors: errors
    })
    const headers = {
        'Content-Type': 'application/json',
    };
    
    return postRequest(`${CURRENT_API}/apinode/get-ai-help`, data, headers)
}

export const getAITalk = async (message: string): Promise<[number, any]> => {

    const data = JSON.stringify({ 
        message: message
    })
    const headers = {
        'Content-Type': 'application/json',
    };

    return postRequest(`${CURRENT_API}/apinode/get-ai-talk`, data, headers)
}

export const apiRegister = async (email: string, password: string): Promise<[number, any]> => {

    const data = JSON.stringify({ 
        email: email,
        password: password
    })
    const headers = {
        'Content-Type': 'application/json',
    };

    return postRequest(`${CURRENT_API}/apinode/register`, data, headers);
};

export const apiLogin = async (email: string, password: string) => {

    const data = JSON.stringify({ 
        email: email,
        password: password
    })
    const headers = {
        'Content-Type': 'application/json',
    };
    
    return postRequest(`${CURRENT_API}/apinode/login`, data, headers);
};

export const apiUpdatePassword = async (token: string, oldPassword: string, newPassword: string) => {

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    }

    const data = JSON.stringify({ 
        oldPassword: oldPassword,
        newPassword: newPassword
    })
    
    return postRequest(`${CURRENT_API}/apinode/change-password`, data, headers);
};