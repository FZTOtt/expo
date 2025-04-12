import { useAppDispatch, useAppSelector } from '@/hooks';
import { setVisibleMedia } from '@/redux/modal';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { View, Image, Modal, Pressable, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Video from 'react-native-video';

interface MediaViewerProps {
    mediaUrl: string;
    style?: object;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ mediaUrl, style }) => {
    console.log(mediaUrl)
    const { isVisibleMedia } = useAppSelector((state: RootState) => state.modal)
    const dispatch = useAppDispatch();
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'unknown'>('unknown')
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('MOUNTED Component index');
        return () => console.log('UNMOUNTED Component index');
    }, []);

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
            console.error('Media type detection error:', error);
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
            onPress={() => dispatch(setVisibleMedia(true))}
            >
            {mediaType === 'image' ? (
                <Image
                source={{ uri: mediaUrl }}
                style={styles.previewMedia}
                resizeMode="contain"
                />
            ) : (
                <>
                <Video
                    source={{ uri: mediaUrl }}
                    style={styles.previewMedia}
                    paused={true}
                    resizeMode="contain"
                />
                <View style={styles.playIcon}>
                    <Text style={styles.playIconText}>▶</Text>
                </View>
                </>
            )}
            </Pressable>
  
            <Modal
                visible={isVisibleMedia}
                transparent={true}
                onRequestClose={() => dispatch(setVisibleMedia(false))}
                >
                <Pressable 
                    style={styles.modalBackdrop}
                    onPress={() => dispatch(setVisibleMedia(false))}
                >
                    {/* Внутренний контейнер, который не закрывает по клику на себя */}
                    <Pressable 
                    style={styles.modalContent}
                    onPress={(e) => e.stopPropagation()} // Останавливаем всплытие
                    >
                    {mediaType === 'image' ? (
                        <Image
                        source={{ uri: mediaUrl }}
                        style={styles.fullscreenMedia}
                        resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.videoWrapper}>
                            <Video
                                source={{ uri: mediaUrl }}
                                style={styles.video}
                                controls={true}
                                resizeMode="contain"
                                paused={!isVisibleMedia}
                            />
                        </View>
                    )}
                    </Pressable>
                </Pressable>
            </Modal>
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
      fontSize: 20,
    },
    modalBackdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    //   backgroundColor: 'rgba(0,0,0,0.9)',
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
        aspectRatio: 16/9, // Сохраняем соотношение сторон
        backgroundColor: 'black',
        overflow: 'hidden', // Важно для ограничения контролов
    },
    video: {
        width: '100%',
        height: '100%',
        // Для Android нужно добавить alignSelf: 'center'
        alignSelf: 'center',
    },
  });
  
  export default MediaViewer;