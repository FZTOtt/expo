import { getPhonemeReference } from "@/api/api";
import { useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, LayoutAnimation } from "react-native"
import Button from "./button";
import AudioPlayer from "./audioPlayer";
import MediaViewer from "./mediaViewer";

type PhonemeReference = {
    phonema: string;
    text: string;
    audio_link: string;
    media_link?: string; 
}

const Reference = () => {
    
    const { targetTranscription, targetWord } = useAppSelector((state: RootState) => state.translated);
    const [phonemes, setPhonemes] = useState<string[]>([])
    const [phonemeDetails, setPhonemeDetails] = useState<PhonemeReference[]>([])
    const [selectedPhoneme, setSelectedPhoneme] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);

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
        setPhonemes(phonemeOrder);
    } 
    
    useEffect(() => {
        parseTranscription(targetTranscription ? targetTranscription : '')
    }, [targetTranscription])

    async function loadPhonemeDetails (phonemes: string[]) {
        try {
            const details = await Promise.all(
                phonemes.map(async _symbol => {
                    const [status, response] = await getPhonemeReference(_symbol)
                    if (status === 200) {
                        let url = response.audio_link;
                        if (url) {
                            url = url.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
                            url = url.replace(/&/g, '\\u0026');
                        }
                        let videoUrl = response.media_link;
                        if (videoUrl) {
                            videoUrl = videoUrl.replace(/http:\/\/[^\/]+/, 'https://ouzistudy.ru/minio');
                            videoUrl = videoUrl.replace(/&/g, '\\u0026');
                        }
                        return {
                            phonema: response.phonema,
                            text: response.text,
                            audio_link: url,
                            media_link: videoUrl
                        } as PhonemeReference;
                    }
                })
            );
            const validDetails = details.filter((item): item is PhonemeReference => item !== null);
            setPhonemeDetails(validDetails);
        } catch (error) {
            console.error('Ошибка в запросе описания фонем', error);
        }
    };
    useEffect(() => {
        if (phonemes.length > 0) {
            loadPhonemeDetails(phonemes);
        }
    }, [phonemes]);

    const handlePhonemePress = (symbol: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedPhoneme(prev => prev === symbol ? null : symbol);
        
        // Прокручиваем к выбранному элементу
        if (selectedPhoneme !== symbol) {
          const index = phonemeDetails.findIndex(item => item.text === symbol);
          setTimeout(() => { // Ждем завершения анимации раскрытия
            flatListRef.current?.scrollToIndex({
              index,
              animated: true,
              viewPosition: 0.3, // Позиция на экране (0 - верх, 1 - низ)
            });
          }, 100);
        }
      };

    const RenderReference = ({ item, index } : { item : PhonemeReference, index : number}) => {
        console.log(item)
        return (
            <View style={styles.references}>
                <TouchableOpacity onPress={() => handlePhonemePress(item.phonema)}>
                    <Text style={styles.references_passiveText}>
                        {item.phonema}
                    </Text>
                </TouchableOpacity>
                {selectedPhoneme === item.phonema && (
                    <View style={styles.phonemeInfo}>
                        <Text style={styles.phonemeDescription}>
                            {item.text}
                        </Text>
                        <View style={styles.playPhonemeContainer}>
                            <Text style={styles.playPhonemeText}>{item.phonema}</Text>
                            <AudioPlayer imgStyle={styles.playButton} audioUrl={item.audio_link}/>
                        </View>
                        {item.media_link && (
                            <MediaViewer 
                                mediaUrl={item.media_link} 
                                style={styles.mediaViewer} 
                            />
                        )}
                    </View>
                )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Справка
            </Text>
            <Text style={styles.wordDescription}>
                {`${targetWord} (${targetTranscription}) - перевод`}
            </Text>
            <FlatList 
            data={phonemeDetails}
            renderItem={RenderReference}
            keyExtractor={(item) => item.phonema}
            showsVerticalScrollIndicator={false}
            onScrollToIndexFailed={({ index }) => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                }, 500);
              }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '50%',
        paddingTop: 30,
        paddingHorizontal: 20,
        flex: 1,
        flexDirection: 'column',
        gap: 10
    },
    header: {
        color: 'white',
        fontSize: 20
    },
    wordDescription: {
        color: 'white',
        fontSize: 18
    },
    references: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(63, 133, 167, 1)',
        width: '100%',
        minHeight: 50,
        // justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingTop: 7
    },
    references_passiveText: {
        color: 'white',
        fontSize: 20,
        // paddingTop: 10
    },
    phonemeInfo: {
        paddingTop: 15,
    },
    phonemeDescription: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 10,
        color: 'white'
    },
    playPhonemeContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    playPhonemeText: {
        fontSize: 20,
        color: 'white'
    },
    mediaViewer: {
        width: 150,
        height: 150,
        marginTop: 10,
        alignSelf: 'center',
    },
    playButton: {
        width: 20,
        height: 20,
    },
})

export default Reference;