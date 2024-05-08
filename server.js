const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/social_media', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Post schema
const PostSchema = new mongoose.Schema({
  content: String,
  likes: { type: Number, default: 0 },
  comments: [{ type: String }],
  imageUrl: String,
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

app.use(bodyParser.json());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/', // Upload directory
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
}).single('photo');

// Handle file upload
app.post('/api/upload', (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    try {
      const newPost = new Post({
        imageUrl: '/uploads/' + req.file.filename,
      });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

// Get all posts with imageUrl field
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({}, 'content likes comments imageUrl'); // Only retrieve specific fields
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CRUD APIs for Posts
app.post('/posts', async (req, res) => {
  const post = new Post({
    content: req.body.content,
  });
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/posts/:id', getPost, (req, res) => {
  res.json(res.post);
});

app.put('/posts/:id', getPost, async (req, res) => {
  if (req.body.content != null) {
    res.post.content = req.body.content;
  }
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.delete('/posts/photo/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      // Remove the photo file from the uploads directory (if required)
      // For simplicity, assuming the file is stored directly in the uploads directory
      const imagePath = path.join(__dirname, 'public', post.imageUrl);
      fs.unlinkSync(imagePath);
      // Remove the photo record from the database
      await post.remove();
      res.json({ message: 'Photo deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update the existing delete route for posts to delete the entire post
  app.delete('/posts/:id', getPost, async (req, res) => {
    try {
      await res.post.remove();
      res.json({ message: 'Post deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Like a Post
app.post('/posts/:id/like', getPost, async (req, res) => {
  res.post.likes++;
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a Comment to a Post
app.post('/posts/:id/comment', getPost, async (req, res) => {
  res.post.comments.push(req.body.comment);
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.post = post;
  next();
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
