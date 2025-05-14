import { getPhonemeReference } from '@/api/api';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setVisible } from '@/redux/modal';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import AudioPlayer from './audioPlayer';
import MediaViewer from './mediaViewer';

interface PhonemeInfo {
    symbol: string;
    description: string;
    audio: string;
    video?: string;
  }

const ReferenceModal = () => {
    const { isVisible, isVisibleMedia } = useAppSelector((state: RootState) => state.modal);
    const { targetTranscription } = useAppSelector((state: RootState) => state.translated);
    const [ transcriptionPhonemes, setTranscriptionPhonemes ] = useState<string[]>([]);
    const [phonemeDetails, setPhonemeDetails] = useState<PhonemeInfo[]>([]);
    const [selectedPhoneme, setSelectedPhoneme] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    let modalWidth = '30%'

    if (Platform.OS !== 'web') {
        modalWidth = '100%'
    }
    
    function onClose() {
        if (!isVisibleMedia) dispatch(setVisible(false));
    }

    function parseTranscription(transcription: string) {
        const phonemeOrder: string[] = []; 
        const seenPhonemes = new Set<string>(); 
        
        const binaryPhonemes = ["ɑː", "iː", "ɔː", "uː", "ɜː", "eɪ", "aɪ", "aʊ", "əʊ", "ɔɪ", "ɪə", "ɛə", "ʊə", "tʃ", "dʒ"];
        let i = 0;
        
        while (i < transcription.length) {
            let found = false;
            
            for (const bp of binaryPhonemes) {
                if (transcription.startsWith(bp, i)) {
                    if (!seenPhonemes.has(bp)) {
                        phonemeOrder.push(bp);
                        seenPhonemes.add(bp);
                    }
                    i += bp.length;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                const char = transcription[i];
                if (!seenPhonemes.has(char) && char !== 'ˈ' && char !== 'ˌ') {
                    phonemeOrder.push(char);
                    seenPhonemes.add(char);
                }
                i++;
            }
        }
        setTranscriptionPhonemes(phonemeOrder);
    } 
    useEffect(() => {
        if (isVisible) parseTranscription(targetTranscription ? targetTranscription : '')
    }, [targetTranscription, isVisible])

    async function loadPhonemeDetails (phonemes: string[]) {
        try {
            const details = await Promise.all(
                phonemes.map(async _symbol => {
                    const [status, response] = await getPhonemeReference(_symbol)
                    if (status === 200) {
                        let url = response.tipAudio;
                        if (url) {
                            url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
                            url = url.replace(/&/g, '\\u0026');
                        }
                        let videoUrl = response.tipPicture;
                        if (videoUrl) {
                            videoUrl = videoUrl.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
                            videoUrl = videoUrl.replace(/&/g, '\\u0026');
                        }
                        return {
                            symbol: response.phonema,
                            description: response.tipText,
                            audio: url,
                            video: videoUrl
                        } as PhonemeInfo;
                    }
                })
            );
            const validDetails = details.filter((item): item is PhonemeInfo => item !== null);
            setPhonemeDetails(validDetails);
        } catch (error) {
            console.error('Ошибка в запросе описания фонем', error);
        }
    };
    useEffect(() => {
        if (transcriptionPhonemes.length > 0) {
            loadPhonemeDetails(transcriptionPhonemes);
        }
    }, [transcriptionPhonemes]);

    if (!isVisible) return null;
    return (
        <Pressable style={styles.modalContainer} onPress={onClose}>
            <Pressable style={[styles.modalContent, { width: modalWidth }]} onPress={(e) => e.stopPropagation()}>
                <View style={styles.header}>
                    <Text style={styles.title}>Справка по произношению</Text>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>×</Text>
                    </Pressable>
                </View>
                
                <Text style={styles.sectionTitle}>{targetTranscription}:</Text>
                
                <ScrollView style={styles.phonemesScroll}>
                    {phonemeDetails.map((phoneme) => (
                        <View key={phoneme.symbol} style={styles.phonemeBlock}>
                            <Pressable 
                                style={styles.phonemeItem}
                                onPress={() => setSelectedPhoneme(
                                    selectedPhoneme === phoneme.symbol ? null : phoneme.symbol
                                )}
                            >
                                <Text style={styles.phonemeSymbol}>{phoneme.symbol}</Text>
                            </Pressable>
                            
                            {selectedPhoneme === phoneme.symbol && (
                                <View style={styles.phonemeInfo}>
                                    <Text style={styles.phonemeDescription}>
                                        {phoneme.description}
                                    </Text>
                                    <View style={styles.playPhonemeContainer}>
                                        <Text style={styles.playPhonemeText}>{phoneme.symbol}</Text>
                                        <AudioPlayer imgStyle={styles.playButton} audioUrl={phoneme.audio}/>
                                    </View>
                                    {phoneme.video && (
                                        <MediaViewer 
                                            mediaUrl={phoneme.video} 
                                            style={styles.mediaViewer} 
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100,
    },
    modalContent: {
        // width: '30%',
        height: '100%',
        backgroundColor: 'white',
        // borderRadius: 10,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#666',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        color: '#444',
    },
    phonemesScroll: {
        flexGrow: 1,
    },
    phonemeBlock: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    phonemeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f9f9f9',
    },
    phonemeSymbol: {
        fontSize: 18,
        fontWeight: 'bold',
        width: 30,
        marginRight: 15,
    },
    phonemeType: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    phonemeInfo: {
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    phonemeDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    },
    phonemeExample: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#2c7be5',
    },
    playButton: {
        width: 20,
        height: 20,
    },
    playPhonemeContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    playPhonemeText: {
        fontSize: 25,
    },
    mediaViewer: {
        width: 150,
        height: 150,
        marginTop: 10,
        alignSelf: 'center',
    },
  });
  
  export default ReferenceModal;