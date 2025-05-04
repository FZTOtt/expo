const express = require('express');
const app = express();
const PORT = 3000;
const pool = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { WordExerciseSchema, PhraseExerciseSchema, ModuleSchema } = require('./schemas');

const uploadDir = path.join(__dirname, 'uploads/audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
  });
  
  const upload = multer({ storage });

app.use(express.json());
app.use('/uploads/audio', express.static(path.join(__dirname, 'uploads/audio')));


app.get('/', (req, res) => {
  res.send('Главная страница 🚀');
});

app.post('/api/create-word-module', async (req, res) => {
    const result = ModuleSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    try {
        const { rows } = await pool.query(
            `INSERT INTO word_modules
            (title)
            VALUES ($1) RETURNING id`,
            [
                result.data.title
            ]
        );
        res.status(201).json({
            payload: {
                id: rows[0].id
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post('/api/create-phrase-module', async (req, res) => {
    const result = ModuleSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    try {
        const { rows } = await pool.query(
            `INSERT INTO phrase_modules
            (title)
            VALUES ($1) RETURNING id`,
            [
                result.data.title
            ]
        );
        res.status(201).json({
            payload: {
                id: rows[0].id
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post('/api/word-exercises', upload.array('audio', 2), async (req, res) => {
    try {
        const { exercise, module_id, words, transcriptions, translations } = req.body;
    
        const parsedWords = JSON.parse(words);
        const parsedTranscriptions = JSON.parse(transcriptions);
        const parsedTranslations = JSON.parse(translations);
    
        const audioLinks = req.files.map(file => `/uploads/audio/${file.filename}`);
    
        const parsedData = {
            exercise,
            module_id: parseInt(module_id, 10),
            words: parsedWords,
            transcriptions: parsedTranscriptions,
            audio: audioLinks,
            translations: parsedTranslations
        };
  
        const result = WordExerciseSchema.safeParse(parsedData);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }
  
        const { rows } = await pool.query(
            `INSERT INTO word_exercises 
            (exercise_type, words, transcriptions, audio, translations, module_id) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
            result.data.exercise,
            result.data.words,
            result.data.transcriptions,
            result.data.audio,
            result.data.translations,
            result.data.module_id,
            ]
        );
  
        res.status(201).json({
            payload: {
                status: "success",
                id: rows[0].id
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/phrases-exercises', upload.single('audio'), async (req, res) => {
    try {
        const { exercise, module_id, sentence, transcription, translate, chain } = req.body;

        const parsedChain = JSON.parse(chain);
    
        const audioLink = req.file?.filename
            ? `/uploads/audio/${req.file.filename}`
            : null;
  
        if (!audioLink) {
            return res.status(400).json({ error: "Аудиофайл обязателен." });
        }
    
        const parsedData = {
            exercise,
            module_id: parseInt(module_id, 10),
            sentence,
            transcription,
            audio: audioLink,
            translate,
            chain: parsedChain
        };
  
        const result = PhraseExerciseSchema.safeParse(parsedData);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }
        const { rows } = await pool.query(
            `INSERT INTO phrase_exercises  
            (exercise_type, sentence, translate, transcription, audio, chain, module_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                result.data.exercise,
                result.data.sentence,
                result.data.translate,
                result.data.transcription,
                result.data.audio,
                result.data.chain,
                result.data.module_id,
            ]
        );
  
        res.status(201).json({
            payload: {
                status: "success",
                id: rows[0].id
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/debug/word-exercises', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM word_exercises');
    res.json(rows);
});

app.get('/api/debug/phrases-exercises', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM phrase_exercises');
    res.json(rows);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});