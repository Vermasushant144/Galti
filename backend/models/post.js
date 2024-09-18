const mongoose = require('mongoose');

// Define the schema for comments
const commentSchema = new mongoose.Schema({
  username: String,
  text: String,
  date: { type: Date, default: Date.now }
});

// Define the schema for posts
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  username: { type: String, required: true },
  description: { type: String, required: true },
  likes: [{ type: String }], // Array of usernames who liked the post
  comments: [commentSchema], // Array of comment objects
  date: { type: Date, default: Date.now }
});

// Export the Post model
module.exports = mongoose.model('Post', postSchema);
