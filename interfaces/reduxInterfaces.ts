export interface TargetWord {
    targetWords: string[];
    targetTranscriptions: string[];
    targetAudioUrls: string[];
    wordTranslations: string[];
}

export interface TargetPhrase {
    targetPhrase: string | null;
    targetAudioUrl: string | null;
    targetTranscription: string | null;
    translatedPhrase: string | null;
}

export interface PhraseChain {
    chain: string[] | null;
    audio: string | null;
}
