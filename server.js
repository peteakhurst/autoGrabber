const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5001;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

const MODELS = {
  ford: {
    Ranger: ['Raptor', 'Raptorx', 'wildtrack'],
    Falcon: ['XR6', 'XR6 Turbo', 'XR8'],
    'Falcon Ute': ['XR6', 'XR6 Turbo'],
  },
  bmw: {
    '130d': ['xDrive 26d', 'xDrive 30d'],
    '240i': ['xDrive 30d', 'xDrive 50d'],
    '320e': ['xDrive 75d', 'xDrive 80d', 'xDrive 85d'],
  },
  tesla: {
    'Model 3': ['Performance', 'Long Range', 'Dual Motor'],
  },
};

app.get('/api/vehicles/:make', (req, res) => {
  const make = req.params.make.toLowerCase();
  if (MODELS[make]) {
    res.json(MODELS[make]);
  } else {
    res.status(404).json({ message: 'Make not found' });
  }
});

app.post('/api/submit', upload.single('logbook'), (req, res) => {
  const { make, model, badge } = req.body;
  const logbookPath = req.file ? req.file.path : null;

  let logbookContent = 'No file uploaded';
  if (logbookPath) {
    logbookContent = fs.readFileSync(logbookPath, 'utf8');
  }

  res.json({
    make,
    model,
    badge,
    logbookContent,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
