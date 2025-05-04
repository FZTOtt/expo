// import { z } from 'zod';
const { z } = require('zod')

const WordExerciseTypeSchema = z.enum([
    'pronounce',
    'guessWord',
    'pronounceFiew',
]);

const PhraseExerciseTypeSchema = z.enum([
    'pronounce',
    'completeChain',
]);

const WordExerciseSchema = z.object({
    exercise: WordExerciseTypeSchema,
    words: z.array(z.string()),
    transcriptions: z.array(z.string()),
    audio: z.array(z.string()),
    translations: z.array(z.string()),
});

const PhraseExerciseSchema = z.object({
    exercise: PhraseExerciseTypeSchema,
    sentence: z.string().optional(),
    translate: z.string().optional(),
    transcription: z.string().optional(),
    audio: z.string(),
    chain: z.array(z.string()).optional(),
});

module.exports = {
    WordExerciseTypeSchema,
    PhraseExerciseTypeSchema,
    WordExerciseSchema,
    PhraseExerciseSchema,
};