import { getAIHelp, getAITalk, getAITextHelp, getPhraseTranscrible } from "@/api/api";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { 
    setShowLoadMessage, 
    writeMessage,
    writeWordsMessage,
    setShowWordsLoad,
    writePhrasesMessage,
    setShowPhrasesLoad
 } from "@/redux/aichat";
import { RootState } from "@/redux/store";
import { usePathname } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    KeyboardAvoidingView,
    Platform
} from "react-native";
import MicOn from '@/assets/icons/micon.svg';
import MicOff from '@/assets/icons/micoff.svg';
import AudioRecorder from './aidoRecorder';

// Тип сообщения
type Message = {
    id: string;
    text: string;
    isUser: boolean; // true - сообщение от пользователя, false - от ИИ
};

const Chat = () => {
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList>(null);
    const { translatedTranscriptions, targetWords, targetTranscriptions } = useAppSelector((state: RootState) => state.word);
    const { detectedPhrase, targetPhrase } = useAppSelector((state: RootState) => state.phrases);
    const { messages, showLoadMessage, wordsMessages, showWordsLoad, phrasesMessages, showPhrasesLoad } = useAppSelector((state: RootState) => state.aiChat);

    const wordHashRef = useRef<string>('');
    const sentenceHashRef = useRef<string>('');

    const [showLoadId, setShowLoadId] = useState<string | null>(null)

    const fullchat = pathname == '/aichat'

    const failedRequsetMessage = 'Извините, сервер перегружен'

    let currentMessages, currentLoad, writeFunc, setLoad;

    if (fullchat) {
        currentMessages = messages;
        currentLoad = showLoadMessage;
        writeFunc = writeMessage;
        setLoad = setShowLoadMessage;
        console.log('полноценный чат')
    } else if (pathname == '/') {
        currentMessages = wordsMessages;
        currentLoad = showWordsLoad;
        writeFunc = writeWordsMessage;
        setLoad = setShowWordsLoad;
        console.log('вспомогательный чат слов')
    } else {
        currentMessages = phrasesMessages;
        currentLoad = showPhrasesLoad;
        writeFunc = writePhrasesMessage;
        setLoad = setShowPhrasesLoad;
        console.log('вспомогательный чат фраз')
    }

    const getAISuggest = async (flag: number, target: string, predict: string, eng_target: string) => {
        const [status, response] = await getAIHelp(flag, target, predict, eng_target)
        if (status == 200) {
            const aiMessage: Message = {
                id: Date.now().toString(),
                text: response.output_text,
                isUser: false,
            }
            dispatch(writeFunc(aiMessage));
        } else {
            const aiMessage: Message = {
                id: Date.now().toString(),
                text: failedRequsetMessage,
                isUser: false,
            }
            dispatch(writeFunc(aiMessage));
        }
        
        dispatch(setShowLoadMessage(false))
    }
                                    
    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
        };

        dispatch(writeFunc(userMessage))
        setInputText("");
        if (pathname === '/') {
            wordHashRef.current = inputText
        } else if (pathname === '/phrases') {
            sentenceHashRef.current = inputText
        }
        let status, response;
        if (fullchat) {
            [status, response] = await getAITalk(inputText);
        } else {
            [status, response] = await getAITextHelp(inputText);
        }
        
        if (status == 200) {
            console.log(response)
            const aiMessage: Message = {
                id: Date.now().toString(),
                text: response.output_text,
                isUser: false,
            }
            dispatch(writeFunc(aiMessage));
        } else {
            const aiMessage: Message = {
                id: Date.now().toString(),
                text: failedRequsetMessage,
                isUser: false,
            }
            dispatch(writeFunc(aiMessage));
        }
    };

    useEffect(() => {
        if (currentMessages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        } else if (pathname == '/aichat') {
            const aiMessage: Message = {
                id: Date.now().toString(),
                text: 'Привет, в будущем мы можем пообщаться на английском языке, а пока я в разработке. Запиши своё предложение, а я распознаю его на английском языке и продолжу беседу',
                isUser: false,
            }
            dispatch(writeMessage(aiMessage));
        }
    }, [currentMessages, messages]);

    const cleanPhonemes = (str: string) => str.replace(/[ˈˌ]/g, '').split('');

    function countWordErrors(detectedPhrase: string, sentence: string): number {
        const normalize = (str: string) =>
            str
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                .split(/\s+/)
    
        const detectedWords = normalize(detectedPhrase);
        const sentenceWords = normalize(sentence);
    
        const maxLength = Math.max(detectedWords.length, sentenceWords.length);
        let errors = 0;
    
        for (let i = 0; i < maxLength; i++) {
            if (detectedWords[i] !== sentenceWords[i]) {
                errors++;
            }
        }
    
        return errors;
    }

    useEffect(() => {

        let currentWordHash = '';
        let currentSentenceHash = '';

        if (pathname === '/' && translatedTranscriptions.length > 0) {
            currentWordHash = `transcriptions:${translatedTranscriptions[0]}`;
        } else if (pathname === '/phrases' && detectedPhrase) {
            currentSentenceHash = `phrase:${detectedPhrase}`;
        }

        if ((wordHashRef.current === currentWordHash || (currentMessages.length !== 0 && !wordHashRef.current)) && pathname === '/') {
            return
        } else if ((sentenceHashRef.current === currentSentenceHash || (currentMessages.length !== 0 && !sentenceHashRef.current)) && pathname === '/phrases') {
            console.log('Вышли', sentenceHashRef.current === currentSentenceHash, sentenceHashRef.current, currentSentenceHash)
            return
        }
        
        if (pathname === '/') {
            wordHashRef.current = currentWordHash
        } else if (pathname === '/phrases') {
            sentenceHashRef.current = currentSentenceHash
        }

        if(pathname == '/') {
            if (translatedTranscriptions.length > 0) {
                getAISuggest(0, targetTranscriptions[0], translatedTranscriptions[0], targetWords[0])
            }
        } else if (pathname == '/phrases') {
            if (detectedPhrase) {
                if (targetPhrase === null) return
                getAISuggest(1, targetPhrase, detectedPhrase, targetPhrase)
            }
        }

    }, [translatedTranscriptions, detectedPhrase]);

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
        styles.messageBubble, 
        item.isUser ? styles.userBubble : styles.aiBubble
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    const handleRecordingComplete = async (audio: Blob | string) => {
        dispatch(setShowLoadMessage(true))
        const [status, response] = await getPhraseTranscrible(audio);
        if (status === 200) {
            const message = response.text
            const userMessage: Message = {
                id: Date.now().toString(),
                text: message,
                isUser: true,
            };
            dispatch(writeMessage(userMessage))
            const [status1, response1] = await getAITalk(message);
            if (status1 == 200) {
                const aiMessage: Message = {
                    id: Date.now().toString(),
                    text: response1.output_text,
                    isUser: false,
                }
                dispatch(writeMessage(aiMessage));
            } else {
                const aiMessage: Message = {
                    id: Date.now().toString(),
                    text: failedRequsetMessage,
                    isUser: false,
                }
                dispatch(writeMessage(aiMessage));
            }
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
    }

    // useEffect(() => {
    //     if (showLoadMessage) {
    //         const currentId = Date.now().toString()
    //         setShowLoadId(currentId)
    //         const loadMessage: Message = {
    //             id: currentId,
    //             text: 'Обрабатываю Ваш запрос',
    //             isUser: false,
    //         }
    //         if (fullchat) {
    //             dispatch(writeMessage(loadMessage));
    //         } else {
    //             dispatch(writeMessage(loadMessage));
    //         }
    //     } else {
    //         // if (showLoadId !== null) {
    //         //     setLocalMessages((prev) => {
    //         //         const newMessages = prev.filter(message => message.id !== showLoadId)
    //         //         return newMessages
    //         //     });
    //         //     setShowLoadId(null)
    //         // }
    //     }
    // }, [currentLoad])

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
        <FlatList
            ref={flatListRef}
            data={currentMessages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
        />
        {fullchat ? (
            <View style={styles.audioInput}>
                <AudioRecorder onState={MicOn} offState={MicOff} size={90} onRecordComplete={handleRecordingComplete}></AudioRecorder>
            </View>
        ) : (        
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Напишите сообщение..."
                    placeholderTextColor="#999"
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>➤</Text>
                </TouchableOpacity>
            </View>) }

        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: '5%',
    },
    messagesContainer: {
        paddingBottom: 16,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'rgba(82, 101, 109, 1)'
    },
    userBubble: {
        alignSelf: 'flex-end',
    },
    aiBubble: {
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: 'white',
        lineHeight: 24
    },
    userMessageText: {
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 4,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(32, 47, 54, 1)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 8,
        color: 'white'
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 18,
    },
    audioInput: {
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 2,
        borderTopColor: 'rgba(82, 101, 109, 1)',
        paddingTop: 30,
        marginTop: 20
    }
});

export default Chat;