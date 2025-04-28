import { getPhonemeReference } from "@/api/api";
import { useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native"
import Button from "./button";

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
        // console.log('разбили на фонемы', phonemeOrder)
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

    const RenderReference = ({ item } : { item : PhonemeReference}) => {
        console.log(item)
        return (
            <Button mode="references">
                {item.phonema}
            </Button>
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
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '50%',
        paddingTop: 30,
        paddingLeft: 20,
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
    }
})

export default Reference;