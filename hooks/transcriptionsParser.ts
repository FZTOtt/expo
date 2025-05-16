export const useTranscriptionParser = () => {

    const ParseWordTranscription = (transcription: string) => {

        const phonemes: string[] = [];  
        
        const binaryPhonemes = ["ɑː", "iː", "ɔː", "uː", "ɜː", "eɪ", "aɪ", "aʊ", "əʊ", "ɔɪ", "ɪə", "ɛə", "ʊə", "tʃ", "dʒ"];
        let i = 0;
        
        while (i < transcription.length) {
            let found = false;
            for (const bp of binaryPhonemes) {
                if (transcription.startsWith(bp, i)) {
                    phonemes.push(bp)
                    i += bp.length;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                const char = transcription[i];
                if (char !== 'ˈ' && char !== 'ˌ') {
                    phonemes.push(char)
                }
                i++;
            }
        }
        return phonemes
    }

    const ParseWordsFromSentence = (sentence: string) => {
        return sentence.replace(/[.,!?;:"“”()]/g, '')
            .trim()
            .split(/\s+/);
    }

    return {
        ParseWordTranscription,
        ParseWordsFromSentence
    }
}