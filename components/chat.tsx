import { getAIHelp, getAITalk, getPhraseTranscrible } from "@/api/api";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setShowLoadMessage, writeMessage } from "@/redux/aichat";
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

    const [localMessages, setLocalMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList>(null);
    const { translatedTranscriptions, targetWords } = useAppSelector((state: RootState) => state.word);
    const { detectedPhrase, targetPhrase } = useAppSelector((state: RootState) => state.phrases);
    const { messages, showLoadMessage } = useAppSelector((state: RootState) => state.aiChat);

    const fullchat = pathname == '/aichat'

    let showLoadId: string | null = null;

    const failedRequsetMessage = 'Извините, сервер перегружен'

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
        };

        if (pathname == '/aichat') {
            console.log('aichat')
            dispatch(writeMessage(userMessage))
            setInputText("");
            const [status, response] = await getAITalk(inputText);
            if (status == 200) {
                const aiMessage: Message = {
                    id: Date.now().toString(),
                    text: response.text,
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
            return;
        }

        setLocalMessages(prev => [...prev, userMessage]);
        setInputText("");

        const [status, response] = await getAITalk(inputText);
        if (status == 200) {
            const aiMessage: Message = {
                id: Date.now().toString(),
                text: response.text,
                isUser: false,
            }
            setLocalMessages(prev => [...prev, aiMessage]);
        } else {
            const aiMessage: Message = {
                id: Date.now().toString(),
                text: failedRequsetMessage,
                isUser: false,
            }
            setLocalMessages(prev => [...prev, aiMessage]);
        }
    };

    useEffect(() => {
        if (pathname == '/aichat') {
            if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: true });
            } else {
                const aiMessage: Message = {
                    id: Date.now().toString(),
                    text: 'Привет, здесь мы можем пообщаться на английском языке, запиши своё предложение, а я распознаю его на английском языке и продолжу беседу',
                    isUser: false,
                }
                dispatch(writeMessage(aiMessage));
            }
        } else {
            if (localMessages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: true });
            }   
        }
        if (messages.length > 0) {
        }
    }, [localMessages, messages]);

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
        const getAISuggest = async (target:string, errors:number) => {
            const [status, response] = await getAIHelp(target, errors)
            if (status == 200) {
                const aiMessage: Message = {
                    id: Date.now().toString(),
                    text: response.text,
                    isUser: false,
                }
                setLocalMessages(prev => [...prev, aiMessage]);
            } else {
                const aiMessage: Message = {
                    id: Date.now().toString(),
                    text: failedRequsetMessage,
                    isUser: false,
                }
                setLocalMessages(prev => [...prev, aiMessage]);
            }
        }
        if(pathname == '/') {
            console.log(translatedTranscriptions)
            if (translatedTranscriptions.length > 0) {
                const originalPhonemes = cleanPhonemes(targetWords[0]);
                const detectedPhonemes = cleanPhonemes(translatedTranscriptions[0]);
        
                const maxLength = Math.max(originalPhonemes.length, detectedPhonemes.length);
                let errors = 0;
            
                for (let i = 0; i < maxLength; i++) {
                    if (originalPhonemes[i] !== detectedPhonemes[i]) {
                        errors++;
                    }
                }
                getAISuggest(targetWords[0], errors)
            }
        } else if (pathname == '/phrases') {
            if (detectedPhrase) {
                const errors = countWordErrors(detectedPhrase, targetPhrase)
                getAISuggest(targetPhrase, errors)
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
        const [status, response] = await getPhraseTranscrible(audio);
        if (status === 200) {
            const message = response.text
            const userMessage: Message = {
                id: Date.now().toString(),
                text: message,
                isUser: true,
            };
            dispatch(writeMessage(userMessage))
            const [status1, response1] = await getAITalk(inputText);
            if (status1 == 200) {
                const aiMessage: Message = {
                    id: Date.now().toString(),
                    text: response1.text,
                    isUser: false,
                }
                dispatch(writeMessage(aiMessage));
            }
        } else {
            console.error('Ошибка при запросе расшифровке аудио')
        }
    }

    useEffect(() => {
        if (showLoadMessage) {
            showLoadId = Date.now().toString()
            const loadMessage: Message = {
                id: showLoadId,
                text: 'Обрабатываю Ваш запрос',
                isUser: false,
            }
            setLocalMessages(prev => [...prev, loadMessage]);
            console.log('добавил сообщение')
        } else {
            console.log('123')
            if (showLoadId !== null) {
                setLocalMessages((prev) => {
                    const newMessages = prev.filter(message => message.id == showLoadId)
                    return newMessages
                });
                showLoadId = null
            }
        }
    }, [showLoadMessage])

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
        <FlatList
            ref={flatListRef}
            data={fullchat ? messages : localMessages}
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
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // height: 300
        borderTopWidth: 2,
        borderTopColor: 'rgba(82, 101, 109, 1)',
        paddingTop: 30,
        marginTop: 20
    }
});

export default Chat;