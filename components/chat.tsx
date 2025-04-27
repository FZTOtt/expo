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

// Тип сообщения
type Message = {
    id: string;
    text: string;
    isUser: boolean; // true - сообщение от пользователя, false - от ИИ
};

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList>(null);

    // Имитация ответа ИИ (можно заменить на реальный API-запрос)
    const getAIResponse = async (userMessage: string) => {
        // Имитация задержки ответа
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Простые ответы (можно подключить GPT или другой API)
        let response = "Я не понял ваш вопрос.";
        if (userMessage.toLowerCase().includes("привет")) response = "Привет! Как дела?";
        if (userMessage.toLowerCase().includes("как дела")) response = "У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?У меня всё отлично! А у тебя?";
        
        return response;
    };

  // Отправка сообщения
    const handleSend = async () => {
        if (!inputText.trim()) return;

        // Добавляем сообщение пользователя
        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText("");

        // Получаем ответ от ИИ
        const aiResponse = await getAIResponse(inputText);
        const aiMessage: Message = {
            id: Date.now().toString(),
            text: aiResponse,
            isUser: false,
        };
        setMessages(prev => [...prev, aiMessage]);
    };

    // Автопрокрутка при новых сообщениях
    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages]);

    // Рендер одного сообщения
    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
        styles.messageBubble, 
        item.isUser ? styles.userBubble : styles.aiBubble
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
        {/* Список сообщений */}
        <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            // indicatorStyle="black"
        />

        {/* Поле ввода и кнопка отправки */}
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
        </View>
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
});

export default Chat;