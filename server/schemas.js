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
    module_id: z.number().int(),
    words: z.array(z.string()),
    transcriptions: z.array(z.string()),
    audio: z.array(z.string()),
    translations: z.array(z.string()),
});

const PhraseExerciseSchema = z.object({
    exercise: PhraseExerciseTypeSchema,
    module_id: z.number().int(),
    sentence: z.string().optional(),
    translate: z.string().optional(),
    transcription: z.string().optional(),
    audio: z.string(),
    chain: z.array(z.string()).optional(),
});

const ModuleSchema = z.object({
    title: z.string()
})

module.exports = {
    WordExerciseTypeSchema,
    PhraseExerciseTypeSchema,
    WordExerciseSchema,
    PhraseExerciseSchema,
    ModuleSchema,
};