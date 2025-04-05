export const getRequestFormData = async (url:string): Promise<[number, any]> => {
    try {
        // console.log('get')
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        });
        if (!response.ok) {
            return [response.status, { error: "Ошибка при получении данных" }];
        }

        const responseFormData = await response.formData();
        const text = responseFormData.get("text");
        const audioBlob = responseFormData.get("audio");

        return [response.status, { text, audioBlob }];

    } catch (error) {
        console.error('error', error)
        return [500, error];
    }
};

export const postRequestFormData = async (
    url: string,
    data: FormData,
    headers: Record<string, string> = {}
): Promise<[number, any]> => {
    console.log('data',data.get('file'))
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                ...headers,
            },
            body: data,
        });

        if (!response.ok) {
            console.log(response.status)
            if (response.status === 504) {
                return [response.status, { error: "Сервер недоступен, попробуйте позже" }];
            }
            return [response.status, { error: "Ошибка при отправке запроса" }];
        }

        const body = await response.json();
        return [response.status, body];
    } catch (error) {
        console.error('error', error)
        return [500, { error: "Сервер недоступен" }];
    }
};

export const getRequest = async (url:string): Promise<[number, any]> => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        });
        if (!response.ok) {
            return [response.status, { error: "Ошибка при получении данных" }];
        }
        const body = await response.json();
        return [response.status, body.payload];
    } catch (error) {
        console.error('error', error)
        return [500, { error: "Сервер недоступен" }];
    }
};
