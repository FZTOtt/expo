const express = require('express');
const app = express();
const PORT = 3000;
const pool = require('./db');
const { WordExerciseSchema, PhraseExerciseSchema } = require('./schemas');

app.use(express.json({ type: 'application/json; charset=utf-8' }));

// Роут для главной страницы
app.get('/', (req, res) => {
  res.send('Главная страница 🚀');
});

app.post('/api/word-exercises', async (req, res) => {
    console.log('Received body:', req.body);
    const result = WordExerciseSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    try {
        const { rows } = await pool.query(
        `INSERT INTO word_exercises 
        (exercise_type, words, transcriptions, audio, translations) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
            result.data.exercise,
            result.data.words,
            result.data.transcriptions,
            result.data.audio,
            result.data.translations,
        ]
        );
        res.status(201).json({
            payload: {
                status: "success"
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/phrases-exercises', async (req, res) => {
    console.log('Received body:', req.body);
    const result = PhraseExerciseSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    try {
        const { rows } = await pool.query(
        `INSERT INTO phrases_exercises  
        (exercise_type, sentence, translate, transcription, audio, chain) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
            result.data.exercise,
            result.data.sentence,
            result.data.translate,
            result.data.transcription,
            result.data.audio,
            result.data.chain,
        ]
        );
        res.status(201).json({
            payload: {
                status: "success"
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/debug/word-exercises', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM word_exercises');
    res.json(rows);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});