
import { Audio } from "expo-av";
import React, { useState } from "react";
import { TouchableOpacity, Image, StyleProp, ViewStyle, ImageStyle } from "react-native";
import PlaySound from '@/assets/icons/playSound.svg'

interface AuidoPlayersProps {
    buttonStyle?: StyleProp<ViewStyle>,
    imgStyle: StyleProp<ImageStyle>,
    audioUrl: string | null,
}

const AudioPlayer: React.FC<AuidoPlayersProps> = ({ buttonStyle, imgStyle, audioUrl }) => {
    
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    async function playRecording() {
        try {
            if (audioUrl) {
                if (sound) {
                    await sound.unloadAsync();
                }
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUrl }
                );
                setSound(newSound);
                await newSound.playAsync();
                }
        } catch (err) {
            console.error('Failed to play recording', err);
        }
    }
    return (
        <TouchableOpacity style={buttonStyle} onPress={playRecording}>
            <PlaySound 
                width={30} height={30}
            />
        </TouchableOpacity>
    )
}

export default AudioPlayer;
