export interface TargetWord {
    targetWords: string[];
    targetTranscriptions: string[];
    targetAudioUrls: string[];
    wordTranslations: string[];
    id: number | null;
}

export interface TargetPhrase {
    targetPhrase: string | null;
    targetAudioUrl: string | null;
    targetTranscription: string | null;
    translatedPhrase: string | null;
    id: number | null;
}

export interface PhraseChain {
    chain: string[];
    sentence: string;
    audio: string | null;
    id: number | null;
}
