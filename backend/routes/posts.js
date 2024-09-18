const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Create a new post
router.post('/create', async (req, res) => {
  try {
    const { username, title, description } = req.body;
    const newPost = new Post({ username, title, description });
    await newPost.save();
    res.status(201).json({ post: newPost });
  } catch (error) {
    console.error('Failed to create post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Like a post
router.post('/like/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { username } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.likes.includes(username)) {
      post.likes.push(username);
      await post.save();
    }
    res.status(200).json({ post });
  } catch (error) {
    console.error('Failed to like post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a comment to a post
router.post('/comment/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { username, text } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ username, text });
    await post.save();
    res.status(200).json({ post });
  } catch (error) {
    console.error('Failed to add comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
