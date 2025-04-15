import { useAppDispatch } from "@/hooks";
import { setTranslatedAudio, setUsersRecording } from "@/redux/translated";
import { Audio } from "expo-av";
import { AndroidAudioEncoder, AndroidOutputFormat, IOSOutputFormat } from "expo-av/build/Audio";
import { useRef, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { SvgProps } from "react-native-svg";

interface AudioRecorderProps {
    onState: React.FC<SvgProps>;
    offState: React.FC<SvgProps>;
    size: number;
    onRecordComplete: (audio: Blob | string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({   
    onState: OnStateIcon,
    offState: OffStateIcon, 
    size, 
    onRecordComplete 
}) => {
    const dispatch = useAppDispatch();

    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recording, setRecording] = useState<Audio.Recording | undefined>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        if (Platform.OS === 'web') {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    dispatch(setUsersRecording(audioUrl));
                    onRecordComplete(audioBlob)
                    audioChunksRef.current = [];
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (error) {
                console.error("Ошибка доступа к микрофону:", error);
            }
        } else {
            try {
                if (permissionResponse?.status !== 'granted') {
                    await requestPermission();
                }
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync({
                    isMeteringEnabled: true,
                    android: {
                    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
                    extension: '.wav',
                    outputFormat: AndroidOutputFormat.DEFAULT,
                    audioEncoder: AndroidAudioEncoder.DEFAULT,
                    },
                    ios: {
                    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
                    extension: '.wav',
                    outputFormat: IOSOutputFormat.LINEARPCM,
                    },
                    web: {
                    mimeType: 'audio/wav',
                    bitsPerSecond: 128000,
                    },
                });   
                setRecording(recording);
                setIsRecording(true);
            } catch (err) {
                console.error('Ошибка начала записи', err);
            }
        }
    }

    async function stopRecording() {
        if (Platform.OS === 'web') {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
                setIsRecording(false);
            }
        } else {
            if (!recording) return;
                
            try {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setIsRecording(false);
                
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                });
                setRecording(undefined);
                dispatch(setUsersRecording(uri));

                if (uri) onRecordComplete(uri)
            } catch (err) {
                console.error('Ошибка сохранения записи', err);
            }
        }
    }

    return (
        <TouchableOpacity 
            onPress={isRecording ? stopRecording : startRecording}
            style={{
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: size / 2,
            }}
        >
        <View style={{ width: size, height: size}}>
          {isRecording ? (
            <OffStateIcon width="100%" height="100%" />
          ) : (
            <OnStateIcon width="100%" height="100%" />
          )}
        </View>
      </TouchableOpacity>
    )
}

export default AudioRecorder;