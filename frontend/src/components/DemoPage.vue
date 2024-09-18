<template>
    <div>
      <!-- Create Post Section -->
      <div class="create-post-container">
        <h2>Create a Post</h2>
        <input v-model="newPost.username" placeholder="Enter your name" />
        <input v-model="newPost.title" placeholder="Enter title" />
        <input v-model="newPost.description" placeholder="Enter description" />
        <button class="btn" @click="createPost">Post</button>
      </div>
  
      <!-- Posts List -->
      <div v-for="post in posts" :key="post._id" class="post">
        <h3>{{ post.title }}</h3>
        <p>{{ post.description }}</p>
        <p><strong>Posted by:</strong> {{ post.username }}</p>
        <div class="post-actions">
          <button @click="likePost(post._id)">Like ({{ post.likes.length }})</button>
          <div class="comment-section">
            <input v-model="commentTexts[post._id]" placeholder="Add a comment" />
            <button @click="addComment(post._id)">Comment</button>
          </div>
          <ul>
            <li v-for="comment in post.comments" :key="comment._id">
              <strong>{{ comment.username }}:</strong> {{ comment.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    
    data() {
      return {
        posts: [],
        newPost: {
          username: '',           // Added username field
          title: '',
          description: ''
        },
        commentTexts: {}
      };
    },
    methods: {
      async createPost() {
        try {
          const response = await axios.post('http://localhost:5000/api/posts/create', this.newPost);
          console.log('Post created:', response.data); // Debug
          this.posts.unshift(response.data.post);
          this.newPost.username = '';
          this.newPost.title = '';
          this.newPost.description = '';
        } catch (error) {
          console.error('Failed to create post:', error);
        }
      },
      async likePost(postId) {
        try {
          const response = await axios.post(`http://localhost:5000/api/posts/like/${postId}`, { username: this.newPost.username });
          console.log('Post liked:', response.data); // Debug
          const index = this.posts.findIndex(post => post._id === postId);
          this.$set(this.posts, index, response.data.post);
        } catch (error) {
          console.error('Failed to like post:', error);
        }
      },
      async addComment(postId) {
        try {
          const response = await axios.post(`http://localhost:5000/api/posts/comment/${postId}`, {
            username: this.newPost.username,
            text: this.commentTexts[postId] || ''
          });
          console.log('Comment added:', response.data); // Debug
          const index = this.posts.findIndex(post => post._id === postId);
          this.$set(this.posts, index, response.data.post);
          this.commentTexts[postId] = '';
        } catch (error) {
          console.error('Failed to add comment:', error);
        }
      },
      async fetchPosts() {
        try {
          const response = await axios.get('http://localhost:5000/api/posts');
          console.log('Posts fetched:', response.data); // Debug
          this.posts = response.data;
          this.posts.forEach(post => {
            this.$set(this.commentTexts, post._id, '');
          });
        } catch (error) {
          console.error('Failed to fetch posts:', error);
        }
      }
    },
    mounted() {
      this.fetchPosts();
    }
  };
  </script>
  
  
  <style scoped>
  /* Create Post Section Styles */
  .create-post-container {
    width: 80%;
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .create-post-container h2 {
    margin-bottom: 15px;
    color: #333;
  }
  
  .create-post-container input {
    width: calc(100% - 100px);
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .create-post-container .btn {
    padding: 10px 20px;
    background-color: #6200ea;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .create-post-container .btn:hover {
    background-color: #3700b3;
  }
  
  /* Post Section Styles */
  .post {
    width: 80%;
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .post h3 {
    margin: 0;
    color: #333;
  }
  
  .post p {
    color: #666;
  }
  
  .post-actions {
    margin-top: 20px;
  }
  
  .post-actions .comment-section {
    margin-top: 15px;
  }
  
  .post-actions input {
    width: calc(100% - 80px);
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .post-actions button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .post-actions button:hover {
    background-color: #0056b3;
  }
  
  .post-actions ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .post-actions li {
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 5px;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .create-post-container, .post {
      width: 90%;
    }
    
    .create-post-container input, .post-actions input {
      width: calc(100% - 80px);
    }
    
    .post-actions button {
      width: 100%;
      margin-top: 10px;
    }
  }
  </style>
  