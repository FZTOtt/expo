const express = require('express');
const app = express();
const PORT = 3000;
const pool = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');

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
app.use(cors({
    origin: 'http://localhost:8081', 
    credentials: true,              
  }));

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
        res.status(200).json({
            status: 200,
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
        res.status(200).json({
            status: 200,
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
  
        res.status(200).json({
            status: 200,
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
  
        res.status(200).json({
            status: 200,
            payload: {
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
    // res.json(rows);
    res.status(200).json({
        status: 200,
        payload: rows
    })
});

app.get('/api/debug/phrases-exercises', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM phrase_exercises');
    // res.json(rows);
    res.status(200).json({
        status: 200,
        payload: rows
    })
});

app.get('/api/current-word-module/', async (req, res) => {
    const userId = 1

    try {
        const { rows } = await pool.query(
        `SELECT m.id
        FROM word_modules m
        JOIN word_exercises e ON e.module_id = m.id
        LEFT JOIN exercise_progress p 
            ON p.exercise_id = e.id AND p.exercise_type = 'word' AND p.user_id = $1
        GROUP BY m.id
        HAVING COUNT(*) FILTER (WHERE p.status = 'completed') < COUNT(*)
        ORDER BY m.id
        LIMIT 1`,
        [userId]
        );
        res.json({ 
            status: 200,
            payload: {
                module_id: rows[0]?.id || null
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/word-modules/:id/exercises', async (req, res) => {
    const moduleId = parseInt(req.params.id);
    const userId = 1;
    try {
        const { rows } = await pool.query(
        `SELECT e.*, COALESCE(p.status, 'none') AS status
        FROM word_exercises e
        LEFT JOIN exercise_progress p 
            ON p.exercise_id = e.id AND p.exercise_type = 'word' AND p.user_id = $1
        WHERE e.module_id = $2`,
        [userId, moduleId]
        );
        res.json({ 
            status: 200,
            payload: 
            {
                exercises: rows
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

app.get('/api/current-phrase-module/', async (req, res) => {
    const userId = 1

    try {
        const { rows } = await pool.query(
        `SELECT m.id
        FROM phrase_modules m
        JOIN phrase_exercises e ON e.module_id = m.id
        LEFT JOIN exercise_progress p 
            ON p.exercise_id = e.id AND p.exercise_type = 'phrase' AND p.user_id = $1
        GROUP BY m.id
        HAVING COUNT(*) FILTER (WHERE p.status = 'completed') < COUNT(*)
        ORDER BY m.id
        LIMIT 1`,
        [userId]
        );
        res.json({ 
            status: 200,
            payload: {
                module_id: rows[0]?.id || null
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/phrase-modules/:id/exercises', async (req, res) => {
    const moduleId = parseInt(req.params.id);
    const userId = 1;
    try {
        const { rows } = await pool.query(
        `SELECT e.*, COALESCE(p.status, 'none') AS status
        FROM phrase_exercises e
        LEFT JOIN exercise_progress p 
            ON p.exercise_id = e.id AND p.exercise_type = 'phrase' AND p.user_id = $1
        WHERE e.module_id = $2`,
        [userId, moduleId]
        );
        res.json({ 
            status: 200,
            payload: 
            {
                exercises: rows
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

app.post('/api/exercise-progress', async (req, res) => {
    const userId = 1;
    const { exercise_id, exercise_type, status } = req.body;
  
    try {
        await pool.query(`
            INSERT INTO exercise_progress (user_id, exercise_id, exercise_type, status)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, exercise_id, exercise_type)
            DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
        `, [userId, exercise_id, exercise_type, status]);
    
        res.status(200).json({ 
            status: 200,
            payload: {
                message: 'Прогресс сохранён'
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/word-modules', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title FROM word_modules ORDER BY id');
        res.status(200).json({ 
            status: 200,
            payload: {
                modules: result.rows
            } 
        });
    } catch (error) {
        console.error('Ошибка при получении модулей слов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/phrase-modules', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title FROM phrase_modules ORDER BY id');
        res.status(200).json({ 
            status: 200,
            payload: {
                modules: result.rows
            } 
        });
    } catch (error) {
        console.error('Ошибка при получении модулей слов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/transcribe-word', upload.single('audio'), async (req, res) => {

    const audioPath = req.file?.path;

    if (!audioPath) {
        return res.status(400).json({ error: "Аудиофайл обязателен." });
    }

    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(audioPath));

        const response = await axios.post('http://94.253.9.254:5001/transcribe', form, {
            headers: form.getHeaders(),
        });

        res.status(200).json({ 
            status: 200,
            payload: response.data

        });
    } catch (error) {
        console.error('Ошибка при получении модулей слов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
})

app.post('/api/transcribe-phrase', upload.single('audio'), async (req, res) => {

    const audioPath = req.file?.path;

    if (!audioPath) {
        return res.status(400).json({ error: "Аудиофайл обязателен." });
    }

    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(audioPath));

        const response = await axios.post('http://94.253.9.254:5000/recognize_speech', form, {
            headers: form.getHeaders(),
        });

        res.status(200).json({ 
            status: 200,
            payload: response.data

        });
    } catch (error) {
        console.error('Ошибка при получении модулей слов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
})

app.post('/api/get-ai-help', async (req, res) => {
    try {
        const {target, errors} = req.body
        const inputText = `Ситуация: Человек произносил на английском языке: \"${target}\", и ошибся в произношении ${errors} раза.\nТебе задание A:\n1) Нужно сообщить ТОЛЬКО о ФАКТЕ ошибки (что она просто есть, БЕЗ ПОДРОБНОСТЕЙ),\n2) Нужно как-то мягко пошутить на этот счёт, и обязательно с эмодзи.\nНужен ТОЛЬКО ответ на два пункта задания A. НЕЛЬЗЯ писать то, что напрямую не относится к ответам на два пункта задания A! СТРОГО соблюдать этот формат ответа!!!`

        const response = await axios.post(
            'http://94.253.9.254:5002/get_helper_text',
            { input_text: inputText },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({ 
            status: 200,
            payload: response.data

        });
    } catch (error) {
        console.error('Ошибка при получении модулей слов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
})


app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});