import { useAppDispatch, useAppSelector } from '@/hooks';
import { useTheme } from '@/hooks/useThemes';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { setVisibleMedia } from '@/redux/modal';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { View, Image, Modal, Pressable, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

interface MediaViewerProps {
    mediaUrl: string;
    style?: object;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ mediaUrl, style }) => {
    const { isVisibleMedia } = useAppSelector((state: RootState) => state.modal)
    const dispatch = useAppDispatch();
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'unknown'>('unknown')
    const [isLoading, setIsLoading] = useState(true);
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

    const { fontSizes } = useTheme();
    const { deviceType } = useWindowDimensions();

    // Новый способ для видео
    const player = useVideoPlayer(mediaUrl);
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    useEffect(() => {
        const checkMediaType = async () => {
            try {
                Image.getSize(
                    mediaUrl,
                    () => {
                        setMediaType('image');
                        setIsLoading(false);
                    },
                    () => {
                        setMediaType('video');
                        setIsLoading(false);
                    }
                );
            } catch (error) {
                setMediaType('unknown');
                setIsLoading(false);
            }
        };
        checkMediaType();
    }, [mediaUrl]);

    if (isLoading) {
        return (
            <View style={[styles.previewContainer, style]}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    if (mediaType === 'unknown') {
        return (
            <View style={[styles.previewContainer, style]}>
                <Text>Неизвестный тип медиа</Text>
            </View>
        );
    }

    return (
        <>
            <Pressable
                style={[styles.previewContainer, style]}
                onPress={() => {
                    if (mediaType === "video") {
                        if (deviceType === "pc") {
                            dispatch(setVisibleMedia(true));
                        } else {
                            setIsPreviewPlaying(true);
                            player.play();
                        }
                    } else if (mediaType === "image") {
                        if (deviceType === "pc") {
                            dispatch(setVisibleMedia(true));
                        }
                    }
                }}
            >
                {mediaType === "image" ? (
                    <Image
                        source={{ uri: mediaUrl }}
                        style={styles.previewMedia}
                        resizeMode="contain"
                    />
                ) : (
                    deviceType !== "pc" && isPreviewPlaying ? (
                        <VideoView
                            style={styles.previewMedia}
                            player={player}
                            allowsFullscreen
                            allowsPictureInPicture
                        />
                    ) : (
                        <>
                            <VideoView
                                style={styles.previewMedia}
                                player={player}
                                allowsFullscreen
                                allowsPictureInPicture
                            />
                        </>
                    )
                )}
            </Pressable>

            {deviceType === "pc" && (
                <Modal
                    visible={isVisibleMedia}
                    transparent={true}
                    onRequestClose={() => dispatch(setVisibleMedia(false))}
                >
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => dispatch(setVisibleMedia(false))}
                    >
                        <Pressable
                            style={styles.modalContent}
                            onPress={(e) => e.stopPropagation()}
                        >
                            {mediaType === "image" ? (
                                <Image
                                    source={{ uri: mediaUrl }}
                                    style={styles.fullscreenMedia}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={styles.videoWrapper}>
                                    <VideoView
                                        style={styles.video}
                                        player={player}
                                        allowsFullscreen
                                        allowsPictureInPicture
                                    />
                                </View>
                            )}
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    previewContainer: {
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    previewMedia: {
        width: '100%',
        height: '100%',
    },
    playIcon: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 50,
        padding: 10,
    },
    playIconText: {
        color: 'white',
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '50%',
        height: '50%',
    },
    fullscreenMedia: {
        width: '50%',
        height: '50%',
    },
    videoWrapper: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: 'black',
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },
});

export default MediaViewer;