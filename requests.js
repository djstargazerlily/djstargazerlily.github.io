const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let songQueue = [];

app.get('/queue', (req, res) => {
  res.json(songQueue);
});

app.post('/queue', (req, res) => {
  const { songName, artistName } = req.body;
  songQueue.push({ songName, artistName });
  res.status(200).send('Song added');
});

app.delete('/queue/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < songQueue.length) {
    songQueue.splice(index, 1);
    res.status(200).send('Song removed');
  } else {
    res.status(400).send('Invalid index');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

/////////////////////////////////////////////////////////////////

const API_URL = 'http://localhost:3000/queue';

// Fetch the queue from the server
const fetchQueue = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  renderQueue(data);
};

// Submit a new song
document.getElementById('songForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const songName = document.getElementById('songName').value;
  const artistName = document.getElementById('artistName').value;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ songName, artistName }),
  });

  document.getElementById('songName').value = '';
  document.getElementById('artistName').value = '';
  fetchQueue();
});

// Remove a song (DJ only)
const removeSong = async (index) => {
  await fetch(`${API_URL}/${index}`, { method: 'DELETE' });
  fetchQueue();
};

fetchQueue();
