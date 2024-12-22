
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

let songs = [];

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../database'));
  },
  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname));
    
  },
});
const upload = multer({ storage });

// Serve static files
router.use('/files', express.static(path.join(__dirname, '../database')));

// Upload a new song
router.post('/upload', upload.single('file'), (req, res) => {
  const { filename } = req.file;
  const title = filename || req.body.title
  const desc = req.body.desc || 'No descriptions are here'
  const newSong = {
    id: songs.length + 1,
    title,
    desc,
    updatedAt: new Date(),
  };
  songs.push(newSong);
  res.json({ message: 'File uploaded successfully.', song: newSong });
});

// Fetch all songs
router.get('/', (req, res) => {
  res.json(songs);
});


router.put('/:id', upload.single('file'), (req, res) => {
  const song = songs.find((s) => s.id === parseInt(req.params.id));
  if (!song) return res.status(404).json({ message: 'Song not found.' });

  const title = req.body.title || song.title;
  const desc = req.body.desc
  const ext = path.extname(song.title)
    const oldFilePath = path.join(__dirname, '../database', song.title);
    const newFilePath = path.join(__dirname, '../database', title+ext); // Define `newTitle`.

    // Replace file
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
      } else {
        console.log('File renamed successfully');
      }
    });

  song.title = title+ext; // Update the song title.
  song.updatedAt = new Date();
  song.desc= desc;

  res.json({ message: 'Song updated successfully.', song });
});


// Delete a song
router.delete('/:id', (req, res) => {
  const songIndex = songs.findIndex((s) => s.id === parseInt(req.params.id));
  if (songIndex === -1) return res.status(404).json({ message: 'Song not found.' });

  const deletedSong = songs.splice(songIndex, 1)[0];
  const filePath = path.join(__dirname, '../database', deletedSong.title);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting file.' });
    res.json({ message: 'Song deleted successfully.' });
  });
});

module.exports = router;

