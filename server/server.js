const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const AUDIO_DIR = 'uploads/audio/';
const METADATA_FILE = 'uploads/metadata.json';

if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });
if (!fs.existsSync(METADATA_FILE)) fs.writeFileSync(METADATA_FILE, '[]');

const WORDS_DIR = 'uploads/words/';
const WORDS_METADATA_FILE = 'uploads/words_metadata.json';

if (!fs.existsSync(WORDS_DIR)) fs.mkdirSync(WORDS_DIR, { recursive: true });
if (!fs.existsSync(WORDS_METADATA_FILE)) fs.writeFileSync(WORDS_METADATA_FILE, '[]');

const uploadTemp = multer({ dest: 'temp/' });

const upload = multer({ 
    dest: AUDIO_DIR,
    limits: { fileSize: 10 * 1024 * 1024 },
});

const wordUpload = multer({ 
    dest: WORDS_DIR,
    limits: { fileSize: 10 * 1024 * 1024 },
});

app.post('/phoneme/upload', upload.single('audio'), (req, res) => {
    try {
        const { phoneme } = req.body;
        if (!req.file || !phoneme) {
            return res.status(400).json({ error: 'Нужны аудио и фонема' });
        }
    
        const metadata = JSON.parse(fs.readFileSync(METADATA_FILE));
        
        metadata.push({
            id: req.file.filename, // Имя файла = ID
            filename: req.file.filename,
            phoneme,
            createdAt: new Date().toISOString()
        });
    
        // Сохраняем метаданные
        fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
    
        // Переименовываем файл (убираем временный суффикс Multer)
        const newPath = path.join(AUDIO_DIR, req.file.filename + '.wav');
        fs.renameSync(req.file.path, newPath);
    
        res.status(201).json({ 
            id: req.file.filename,
            phoneme 
        });
  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/word/upload', wordUpload.single('audio'), (req, res) => {
    try {
        const { word, transcription } = req.body;
        
        if (!req.file || !word || !transcription) {
            return res.status(400).json({ 
                error: 'Необходимы: аудиофайл, слово и транскрипция' 
            });
        }

        const wordsMetadata = JSON.parse(fs.readFileSync(WORDS_METADATA_FILE));
        
        const newWord = {
            id: req.file.filename,
            filename: req.file.filename + '.wav',
            word,
            transcription,
            createdAt: new Date().toISOString()
        };
        wordsMetadata.push(newWord);

        // Сохраняем метаданные
        fs.writeFileSync(WORDS_METADATA_FILE, JSON.stringify(wordsMetadata, null, 2));

        // Переименовываем аудиофайл
        const newPath = path.join(WORDS_DIR, req.file.filename + '.wav');
        fs.renameSync(req.file.path, newPath);

        res.status(201).json({
            id: newWord.id,
            word: newWord.word,
            transcription: newWord.transcription
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/node/random_phoneme', (req, res) => {
    try {
        const metadata = JSON.parse(fs.readFileSync(METADATA_FILE));
        if (metadata.length === 0) {
            return res.status(404).json({ error: 'Нет доступных фонем' });
        }

        // Выбираем случайную запись
        const randomIndex = Math.floor(Math.random() * metadata.length);
        const randomPhoneme = metadata[randomIndex];

        // Формируем URL для скачивания аудио
        const audioUrl = `http://${req.get('host')}/api/audio/${randomPhoneme.id}`;

        res.json({
            status: 200,
            payload: {
                phoneme: randomPhoneme.phoneme,
                audioUrl: audioUrl,
            }

        });

    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении фонемы' });
    }
});

app.get('/api/audio/:id', (req, res) => {
    try {
        const filePath = path.join(AUDIO_DIR, req.params.id + '.wav');
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Аудио не найдено' });
        }
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка скачивания' });
    }
});


app.get('/word/random', (req, res) => {
    try {
        const words = JSON.parse(fs.readFileSync(WORDS_METADATA_FILE));
        
        if (words.length === 0) {
            return res.status(404).json({ error: 'Слова не найдены' });
        }

        // Выбираем случайное слово
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        // Формируем URL для аудио
        const audioUrl = `http://${req.get('host')}/word/audio/${randomWord.id}`;

        res.json({
            status: 200,
            payload: {
                word: randomWord.word,
                transcription: randomWord.transcription,
                audioUrl: audioUrl
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении слова' });
    }
});

app.get('/word/audio/:id', (req, res) => {
    try {
        const filePath = path.join(WORDS_DIR, req.params.id + '.wav');
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Аудио не найдено' });
        }

        res.download(filePath);
        
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при скачивании аудио' });
    }
});

app.post('/audio/translate_audio_phoneme', uploadTemp.single('file'), async (req, res) => {
    try {
        if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
        }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), {
        filename: 'audio.wav',
        contentType: 'audio/wav',
    });

    const mlResponse = await axios.post('http://94.253.9.254:5001/transcribe', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({
        status: 200,    
        payload: {
            transcription: mlResponse.data.transcription || '',
        },
    });

  } catch (error) {
        console.error('Ошибка:', error.message);
        if (error.response?.status === 504) {
            res.status(504).json({ error: 'Сервер ML недоступен, попробуйте позже' });
        } else {
            res.status(500).json({ error: 'Ошибка при обработке файла' });
        }
  }
});

app.post('/audio/translate_audio_word', uploadTemp.single('file'), async (req, res) => {
    try {
        if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
        }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), {
        filename: 'audio.wav',
        contentType: 'audio/wav',
    });

    const mlResponse = await axios.post('http://94.253.9.254:5001/transcribe', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({
        status: 200,    
        payload: {
            transcription: mlResponse.data.transcription || '',
        },
    });

  } catch (error) {
        console.error('Ошибка:', error.message);
        if (error.response?.status === 504) {
            res.status(504).json({ error: 'Сервер ML недоступен, попробуйте позже' });
        } else {
            res.status(500).json({ error: 'Ошибка при обработке файла' });
        }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});