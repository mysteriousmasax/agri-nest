import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/', (req, res) => res.send('AGRI-NEST TS stub'));

app.post('/jicho/scan', (req, res) => {
  const diagnoses = ['Yellow Rust', 'Leaf Blight', 'Healthy', 'Bean Rust'];
  const choice = diagnoses[Math.floor(Math.random() * diagnoses.length)];
  const confidence = Math.round((0.5 + Math.random() * 0.5) * 100) / 100;
  res.json({ diagnosis: choice, confidence });
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app.listen(port, () => console.log(`AGRI-NEST TS stub listening on http://localhost:${port}`));
