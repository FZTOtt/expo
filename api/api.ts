import { postRequestFormData, getRequest } from "./ajax";

const API_BASE_URL = "https://ouzistudy.ru/api";
// localhost:8080

/*
    Запрос для распознавания аудио
*/
export const translateAudio = async (audioBlob: Blob | any): Promise<[number, any]> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    console.log('FormData content:', formData.get('file'));
  
    return postRequestFormData(`${API_BASE_URL}/audio/translate_audio`, formData);
};

/*
    Запрос на слово
*/
export const getWord = async(word:string): Promise<[number, any]> => {

    return getRequest(`${API_BASE_URL}/word/${word}`)
}