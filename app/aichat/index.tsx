import Navigation from "@/components/navigation";
import { View, StyleSheet } from "react-native";
import Chat from "@/components/chat";
import { useState } from "react";
import { useEffect } from "react";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

const AIChat = () => {

    const { deviceType } = useWindowDimensions();
    
    return (
        <View style={styles.container}>
            <Navigation />
            <View style={[styles.chatContainer, deviceType === 'mobile' && {marginBottom: 100, borderRightWidth: 0}]}>
                <Chat />
            </View>
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