
import { Audio } from "expo-av";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { AudioPlayerProps } from "@/interfaces/componentsProps";


const AudioPlayer: React.FC<AudioPlayerProps> = ({ buttonStyle, audioUrl, children, onPress, disabled }) => {
    
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    async function playRecording() {
        console.log('play')
        onPress?.()
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
        <TouchableOpacity style={buttonStyle} onPress={playRecording} disabled={disabled}>
            {children}
        </TouchableOpacity>
    )
}

export default AudioPlayer;
