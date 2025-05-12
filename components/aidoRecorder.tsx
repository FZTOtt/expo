import { useAppDispatch } from "@/hooks";
import { setUsersRecording } from "@/redux/translated";
import { Audio } from "expo-av";
import { AndroidAudioEncoder, AndroidOutputFormat, IOSOutputFormat } from "expo-av/build/Audio";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, TouchableOpacity, View } from "react-native";
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
    const pressTimer = useRef<NodeJS.Timeout | null>(null);
    const hasLongPressed = useRef(false);
    const blockNextTap = useRef(false);

    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recording, setRecording] = useState<Audio.Recording | undefined>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.4,
                        duration: 700,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 700,
                        easing: Easing.in(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            scaleAnim.stopAnimation();
            scaleAnim.setValue(1);
        }
    }, [isRecording]);

    const handlePressIn = () => {
        hasLongPressed.current = false;
        pressTimer.current = setTimeout(() => {
            hasLongPressed.current = true;
            startRecording();
        }, 50);
    };

    const handlePressOut = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }

        if (hasLongPressed.current) {
            if (isRecording) stopRecording();
            blockNextTap.current = true;
            setTimeout(() => (blockNextTap.current = false), 300);
        }
    };

    const handleTap = () => {
        if (blockNextTap.current) return;

        if (!hasLongPressed.current) {
            if (!isRecording) startRecording();
            else stopRecording();
        }
    };

    const startRecording = async () => {
        console.log('start')
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
        console.log('stop')
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
            onPress={handleTap}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: size / 2,
            }}
        >
        {/* <View style={{ width: size, height: size}}>
          {isRecording ? (
            <OffStateIcon width="100%" height="100%" />
          ) : (
            <OnStateIcon width="100%" height="100%" />
          )}
        </View> */}
            <Animated.View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: isRecording ? 'red' : 'gray',
                    transform: [{ scale: scaleAnim }],
                    shadowColor: 'red',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: isRecording ? 0.6 : 0,
                    shadowRadius: 10,
                }}
            >
                <OnStateIcon width="100%" height="100%" />
            </Animated.View>
      </TouchableOpacity>
    )
}

export default AudioRecorder;