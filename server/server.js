const express = require('express');
const app = express();
const PORT = 3001;
const pool = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;

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
    origin: ['http://localhost:8081', 'https://ouzistudy.ru'], 
    credentials: true,
}));

function authenticateTokenOptional(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        req.user = undefined;
        return next();
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.user = undefined;
        } else {
            req.user = user;
        }
        next();
    });
}

app.get('/apinode/', (req, res) => {
  res.send('Главная страница 🚀');
});

app.post('/apinode/create-word-module', async (req, res) => {
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

app.post('/apinode/create-phrase-module', async (req, res) => {
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

app.post('/apinode/word-exercises', upload.array('audio', 2), async (req, res) => {
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
                id: rows[0].id
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/apinode/phrases-exercises', upload.single('audio'), async (req, res) => {
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

app.get('/apinode/debug/word-exercises', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM word_exercises');
    // res.json(rows);
    res.status(200).json({
        status: 200,
        payload: rows
    })
});

app.get('/apinode/debug/phrases-exercises', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM phrase_exercises');
    // res.json(rows);
    res.status(200).json({
        status: 200,
        payload: rows
    })
});

app.get('/apinode/current-word-module/', authenticateTokenOptional, async (req, res) => {

    const userId = req.user?.id;
    console.log(userId)

    if (!userId) {
        return res.json({
            status: 200,
            payload: { module_id: 1 }
        });
    }

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
                module_id: rows[0]?.id || 1
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/apinode/current-phrase-module/', authenticateTokenOptional, async (req, res) => {
    
    const userId = req.user?.id;

    if (!userId) {
        return res.json({
            status: 200,
            payload: { module_id: 1 }
        });
    }

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
                module_id: rows[0]?.id || 1
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


app.get('/apinode/word-modules/:id/exercises', authenticateTokenOptional, async (req, res) => {
    const moduleId = parseInt(req.params.id);
    const userId = req.user?.id;
    try {
        let rows;
        if (userId) {
            // Если пользователь авторизован — возвращаем статус выполнения
            const result = await pool.query(
                `SELECT e.*, 
                    COALESCE(p.status, 'none') AS status
                FROM word_exercises e
                LEFT JOIN exercise_progress p 
                    ON p.exercise_id = e.id AND p.exercise_type = 'word' AND p.user_id = $1
                    WHERE e.module_id = $2`,
                [userId, moduleId]
            );
            rows = result.rows;
        } else {
            // Если не авторизован — возвращаем без статистики
            const result = await pool.query(
                `SELECT e.*, 'none' AS status
                FROM word_exercises e
                WHERE e.module_id = $1`,
                [moduleId]
            );
            rows = result.rows;
        }
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


app.get('/apinode/phrase-modules/:id/exercises', authenticateTokenOptional, async (req, res) => {
    const moduleId = parseInt(req.params.id);
    const userId = req.user?.id;
    try {
        let rows;
        if (userId) {
            const { rows } = await pool.query(
                `SELECT e.*, 
                    COALESCE(p.status, 'none') AS status
                FROM phrase_exercises e
                LEFT JOIN exercise_progress p 
                    ON p.exercise_id = e.id AND p.exercise_type = 'phrase' AND p.user_id = $1
                    WHERE e.module_id = $2`,
                [userId, moduleId]
            );
            rows = result.rows; 
        } else {
            const result = await pool.query(
                `SELECT e.*, 'none' AS status
                FROM phrase_exercises e
                WHERE e.module_id = $1`,
                [moduleId]
            );
            rows = result.rows;
        }
        
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

app.post('/apinode/exercise-progress', authenticateTokenOptional, async (req, res) => {
    const userId = req.user?.id;
    const { exercise_id, exercise_type, status } = req.body;
  
    try {
        if (!userId) {
            res.status(200).json({ 
                status: 200,
                payload: {
                    message: 'Пользователь не авторизован'
                } 
            });
        }
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

app.get('/apinode/word-modules', async (req, res) => {
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

app.get('/apinode/phrase-modules', async (req, res) => {
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

app.post('/apinode/transcribe-word', upload.single('audio'), async (req, res) => {

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

app.post('/apinode/transcribe-phrase', upload.single('audio'), async (req, res) => {

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

app.post('/apinode/get-ai-help', async (req, res) => {
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

app.post('/apinode/get-ai-talk', async (req, res) => {
    try {
        const { message } = req.body

        const response = await axios.post(
            'http://94.253.9.254:5003/generate_dialog',
            { input_text: message },
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

app.post('/apinode/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email и пароль обязательны" });

    try {
        const hash = await bcrypt.hash(password, 10);
        const { rows } = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email',
            [email, hash, name]
        );
        const user = rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ 
            status: 200,
            payload: {
                token,
                email: user.email
            }
        });
    } catch (err) {
        console.log(err)
        if (err.code === '23505') {
            res.status(400).json({ error: "Пользователь уже существует" });
        } else {
            res.status(500).json({ error: "Ошибка сервера" });
        }
    }
});

app.post('/apinode/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email и пароль обязательны" });

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];
        if (!user) return res.status(400).json({ error: "Неверный email или пароль" });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(400).json({ error: "Неверный email или пароль" });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ 
            status: 200,
            payload: {
                token,
                email: user.email 
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});