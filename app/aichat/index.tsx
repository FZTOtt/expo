import LeftBar from "@/components/leftBar";
import RightBar from "@/components/rightBar";
import { View, StyleSheet } from "react-native";
import Chat from "@/components/chat";

const AIChat = () => {
    return (
        <View style={styles.container}>
            <LeftBar />
            <View style={styles.chatContainer}>
                <Chat />
            </View>
            <RightBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(19, 31, 36, 1)',
        flexDirection: 'row'
    },
    chatContainer: {
        flex: 1,
        borderRightWidth: 2,
        borderColor: 'rgba(82, 101, 109, 1)',
        paddingVertical: 50
    }
});

export default AIChat;