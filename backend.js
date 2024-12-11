// Backend Code for Social Media Application
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

let users = [];
let posts = [];

// User registration
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const user = { id: uuidv4(), username, email, password };
  users.push(user);
  res.status(201).json({ message: 'User registered successfully', user });
});

// Get all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Create a post
app.post('/posts', upload.single('media'), (req, res) => {
  const { userId, content } = req.body;
  const mediaUrl = req.file ? req.file.filename : null;
  const post = {
    id: uuidv4(),
    userId,
    content,
    mediaUrl,
    likes: 0,
    comments: [],
  };
  posts.push(post);
  res.status(201).json({ message: 'Post created successfully', post });
});

// Like a post
app.post('/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.likes += 1;
    res.json({ message: 'Post liked', post });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Comment on a post
app.post('/posts/:id/comment', (req, res) => {
  const { id } = req.params;
  const { userId, comment } = req.body;
  const post = posts.find((p) => p.id === id);
  if (post) {
    const newComment = { id: uuidv4(), userId, comment };
    post.comments.push(newComment);
    res.json({ message: 'Comment added', post });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
