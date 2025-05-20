import { Platform } from "react-native";
import { postRequest, getRequest } from "./ajax";
import { PhrasesExerciseApiResponse, WordExerciseApiResponse } from "@/interfaces/apiResponses";

const API_BASE_URL = "https://ouzistudy.ru/api";
const NODE_API_URL = "http://localhost:3001/apinode";
const NODE_API_DEPLOY = "https://ouzistudy.ru/apinode";
const CURRENT_API = NODE_API_DEPLOY;
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

export const getCurrentWordModule = async (token?: string | null): Promise<[number, any]> => {
    
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    }

    return getRequest(`${CURRENT_API}/current-word-module/`, token ? headers : {})
}

export const getWordModuleExercises = async (id: number, token?: string | null): Promise<[number, any]> => {

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    }

    return getRequest(`${CURRENT_API}/word-modules/${id}/exercises`, token ? headers : {})
}

export const getCurrentPhraseModule = async (token?: string | null): Promise<[number, any]> => {

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    }

    return getRequest(`${CURRENT_API}/current-phrase-module/`, token ? headers : {})
}

export const getPhraseModuleExercises = async (id: number, token?: string | null): Promise<[number, any]> => {

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    }

    return getRequest(`${CURRENT_API}/phrase-modules/${id}/exercises`, token ? headers : {})
}

export const getWordModules = async (): Promise<[number, any]> => {

    return getRequest(`${CURRENT_API}/word-modules`)
}

export const getPhraseModules = async (): Promise<[number, any]> => {

    return getRequest(`${CURRENT_API}/phrase-modules`)
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
    
    return postRequest(`${CURRENT_API}/transcribe-word`, formData, headers);
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
    
    return postRequest(`${CURRENT_API}/transcribe-phrase`, formData, headers);
};

export const getAIHelp = async (flag: number, target: string, predict: string, eng_target: string): Promise<[number, any]> => {

    const data = JSON.stringify({ 
        flag: flag,
        target: target,
        predict: predict,
        eng_target: eng_target
    })
    const headers = {
        'Content-Type': 'application/json',
    };
    
    return postRequest(`${CURRENT_API}/get-ai-help`, data, headers)
}

export const getAITalk = async (message: string): Promise<[number, any]> => {

    const data = JSON.stringify({ 
        message: message
    })
    const headers = {
        'Content-Type': 'application/json',
    };

    return postRequest(`${CURRENT_API}/get-ai-talk`, data, headers)
}

export const apiRegister = async (email: string, password: string, name: string): Promise<[number, any]> => {

    const data = JSON.stringify({ 
        email: email,
        password: password,
        name: name
    })
    const headers = {
        'Content-Type': 'application/json',
    };

    return postRequest(`${CURRENT_API}/register`, data, headers);
};

export const apiLogin = async (email: string, password: string) => {

    const data = JSON.stringify({ 
        email: email,
        password: password
    })
    const headers = {
        'Content-Type': 'application/json',
    };
    
    return postRequest(`${CURRENT_API}/login`, data, headers);
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
    
    return postRequest(`${CURRENT_API}/change-password`, data, headers);
};

export const sendExerciseProgress = async (
    exercise_id: number, 
    exercise_type: 'phrase' | 'word', 
    status: string,
    token?: string | null
) : Promise<[number, any]> => {

    const data = JSON.stringify({ 
        exercise_id: exercise_id,
        exercise_type: exercise_type,
        status: status
    })

    let headers;
    if (token) {
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    } else {
        headers = {
            "Content-Type": "application/json",
        }
    }
    
    return postRequest(`${CURRENT_API}/exercise-progress`, data, headers);
}

export const restoreSession = async(token: string | null) : Promise<[number, any]> => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    }

    return getRequest(`${CURRENT_API}/me`, token ? headers : {})
}

export const getAITextHelp = async(message: string) : Promise<[number, any]> => {
    const headers = {
        "Content-Type": "application/json",
    }

    const data = JSON.stringify({
        message: message
    })

    return postRequest(`${CURRENT_API}/get-ai-text-help`, data, headers)
}