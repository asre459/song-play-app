
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const router = express.Router();

// let songs = [];

// // Configure Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../database'));
//   },
//   filename: (req, file, cb) => {
//     const originalName = path.basename(file.originalname);
//     cb(null, originalName);
    
//   },
// });
// // const upload = multer({ storage });
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /audio\/mpeg|audio\/mp3/;
//     if (!allowedTypes.test(file.mimetype)) {
//       return cb(new Error('Invalid file type. Only MP3 files are allowed.'));
//     }
//     cb(null, true);
//   },
// });
// // Serve static files
// router.use('/files', express.static(path.join(__dirname, '../database')));
// router.use('/favorites', express.static(path.join(__dirname, '../database/favorites')));
// // Upload a new song
// router.post('/upload', upload.single('file'), (req, res) => {
//   const { filename } = req.file;
//   const title = filename || req.body.title
//   const desc = req.body.desc || 'No descriptions are here'
//   const newSong = {
//     id: songs.length + 1,
//     title,
//     desc,
//     updatedAt: new Date(),
//   };
//   songs.push(newSong);
//   res.json({ message: 'File uploaded successfully.', song: newSong });
// });

// // Fetch all songs
// router.get('/', (req, res) => {
//   res.json(songs);
// });
// router.get('/favorites', (req, res) => {
//   const favoritesPath = path.join(__dirname, '../database/favorites');
//   if (!fs.existsSync(favoritesPath)) {
//     fs.mkdirSync(favoritesPath);
//   }

//   const favoriteFiles = fs.readdirSync(favoritesPath).map((file, index) => ({
//     id: index + 1,
//     title: file,
//     desc: 'Favorite song',
//   }));

//   res.json(favoriteFiles);
// });

// // Add to favorites
// router.post('/favorites', (req, res) => {
//   const { title } = req.body;

//   const sourcePath = path.join(__dirname, '../database', title);

//   const targetPath = path.join(__dirname, '../database/favorites', title);

//   if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
//     fs.copyFileSync(sourcePath, targetPath);
//     res.json({ message: 'Added to favorites successfully.' });
//   } else {
//     res.status(400).json({ message: 'Song already in favorites or not found.' });
//   }
// });

// // Remove from favorites
// router.delete('/favorites/:id', (req, res) => {
//   const { id } = req.params;
//   const favoritesPath = path.join(__dirname, '../database/favorites');
//   const favoriteFiles = fs.readdirSync(favoritesPath);
//   const fileToRemove = favoriteFiles[id - 1];

//   if (fileToRemove) {
//     fs.unlinkSync(path.join(favoritesPath, fileToRemove));
//     res.json({ message: 'Removed from favorites successfully.' });
//   } else {
//     res.status(404).json({ message: 'Favorite not found.' });
//   }
// });


// router.put('/:id', upload.single('file'), (req, res) => {
//   const song = songs.find((s) => s.id === parseInt(req.params.id));
//   if (!song) return res.status(404).json({ message: 'Song not found.' });

//   const title = req.body.title || song.title;
//   const desc = req.body.desc
//   const ext = path.extname(song.title)
//     const oldFilePath = path.join(__dirname, '../database', song.title);
//     const newFilePath = path.join(__dirname, '../database', title+ext); // Define `newTitle`.

//     // Replace file
//     fs.rename(oldFilePath, newFilePath, (err) => {
//       if (err) {
//         console.error('Error renaming file:', err);
//       } else {
//         console.log('File renamed successfully');
//       }
//     });

//   song.title = title+ext; // Update the song title.
//   song.updatedAt = new Date();
//   song.desc= desc;

//   res.json({ message: 'Song updated successfully.', song });
// });


// // Delete a song
// router.delete('/:id', (req, res) => {
//   const songIndex = songs.findIndex((s) => s.id === parseInt(req.params.id));
//   if (songIndex === -1) return res.status(404).json({ message: 'Song not found.' });

//   const deletedSong = songs.splice(songIndex, 1)[0];
//   const filePath = path.join(__dirname, '../database', deletedSong.title);

//   fs.unlink(filePath, (err) => {
//     if (err) return res.status(500).json({ message: 'Error deleting file.' });
//     res.json({ message: 'Song deleted successfully.' });
//   });
// });

// module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

let songs = [];

// Ensure the database directory exists
const databasePath = path.join(__dirname, '../database');
if (!fs.existsSync(databasePath)) {
  fs.mkdirSync(databasePath, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, databasePath);
  },
  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /audio\/mpeg|audio\/mp3/;
    if (!allowedTypes.test(file.mimetype)) {
      return cb(new Error('Invalid file type. Only MP3 files are allowed.'));
    }
    cb(null, true);
  },
});

// Serve static files
router.use('/files', express.static(databasePath));
router.use('/favorites', express.static(path.join(databasePath, 'favorites')));

// Upload a new song
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }

  const { filename } = req.file;
  const title = req.body.title || filename;
  const desc = req.body.desc || 'No descriptions are here';

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

// Fetch favorite songs
router.get('/favorites', (req, res) => {
  const favoritesPath = path.join(databasePath, 'favorites');
  if (!fs.existsSync(favoritesPath)) {
    fs.mkdirSync(favoritesPath);
  }

  const favoriteFiles = fs.readdirSync(favoritesPath).map((file, index) => ({
    id: index + 1,
    title: file,
    desc: 'Favorite song',
  }));

  res.json(favoriteFiles);
});

// Add to favorites
router.post('/favorites', (req, res) => {
  const { title } = req.body;

  const sourcePath = path.join(databasePath, title);
  const targetPath = path.join(databasePath, 'favorites', title);

  if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
    fs.copyFileSync(sourcePath, targetPath);
    res.json({ message: 'Added to favorites successfully.' });
  } else {
    res.status(400).json({ message: 'Song already in favorites or not found.' });
  }
});

// Remove from favorites
router.delete('/favorites/:id', (req, res) => {
  const { id } = req.params;
  const favoritesPath = path.join(databasePath, 'favorites');
  const favoriteFiles = fs.readdirSync(favoritesPath);
  const fileToRemove = favoriteFiles[id - 1];

  if (fileToRemove) {
    fs.unlinkSync(path.join(favoritesPath, fileToRemove));
    res.json({ message: 'Removed from favorites successfully.' });
  } else {
    res.status(404).json({ message: 'Favorite not found.' });
  }
});

// Update a song
router.put('/:id', upload.single('file'), (req, res) => {
  const song = songs.find((s) => s.id === parseInt(req.params.id));
  if (!song) {
    return res.status(404).json({ message: 'Song not found.' });
  }

  const title = req.body.title || song.title;
  const desc = req.body.desc || song.desc;
  const ext = path.extname(song.title);

  const oldFilePath = path.join(databasePath, song.title);
  const newFilePath = path.join(databasePath, title + ext);

  if (fs.existsSync(oldFilePath)) {
    fs.renameSync(oldFilePath, newFilePath);
  }

  song.title = title + ext;
  song.desc = desc;
  song.updatedAt = new Date();

  res.json({ message: 'Song updated successfully.', song });
});

// Delete a song
router.delete('/:id', (req, res) => {
  const songIndex = songs.findIndex((s) => s.id === parseInt(req.params.id));
  if (songIndex === -1) {
    return res.status(404).json({ message: 'Song not found.' });
  }

  const deletedSong = songs.splice(songIndex, 1)[0];
  const filePath = path.join(databasePath, deletedSong.title);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.json({ message: 'Song deleted successfully.' });
});

module.exports = router;
