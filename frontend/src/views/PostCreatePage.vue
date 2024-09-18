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

    <!-- Posts List in a Grid -->
    <div class="posts-grid">
      <div v-for="(post, index) in displayedPosts" :key="post._id" class="post">
        <h3>{{ post.title }}</h3>
        <!-- Truncate the description in the card view -->
        <p>{{ truncateDescription(post.description, 100) }}</p>
        <p><strong>Posted by:</strong> {{ post.username }}</p>
        <button @click="openPostDetails(index)">View Details</button>
      </div>
    </div>

    <!-- Load More Button -->
    <button v-if="hasMorePosts" @click="loadMorePosts">Load More</button>

    <!-- Post Details Modal -->
    <div v-if="selectedPost" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h3>{{ selectedPost.title }}</h3>
        <div class="modal-description">
          <p>{{ selectedPost.description }}</p>
        </div>
        <p><strong>Posted by:</strong> {{ selectedPost.username }}</p>
        <button class="like-btn" @click="likePost(selectedPost._id)">Like ({{ selectedPost.likes.length }})</button>

        <!-- Comment Section -->
        <div class="comment-section">
          <input v-model="commentTexts[selectedPost._id]" placeholder="Add a comment" />
          <button @click="addComment(selectedPost._id)">Comment</button>
          <ul>
            <li v-for="comment in selectedPost.comments" :key="comment._id">
              <strong>{{ comment.username }}:</strong> {{ comment.text }}
            </li>
          </ul>
        </div>
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
      displayedPosts: [],
      newPost: {
        username: '',
        title: '',
        description: ''
      },
      commentTexts: {},
      selectedPost: null,
      postsPerPage: 5,
      currentPage: 0,
    };
  },
  computed: {
    hasMorePosts() {
      return this.posts.length > this.displayedPosts.length;
    }
  },
  methods: {
    async createPost() {
      try {
        const response = await axios.post('http://localhost:5000/api/posts/create', this.newPost);
        this.posts.unshift(response.data.post);
        this.updateDisplayedPosts();
        this.newPost.username = '';
        this.newPost.title = '';
        this.newPost.description = '';
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    },
    // Truncate the description for display on cards
    truncateDescription(description, maxLength) {
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
      }
      return description;
    },
    updateDisplayedPosts() {
      const start = 0;
      const end = (this.currentPage + 1) * this.postsPerPage;
      this.displayedPosts = this.posts.slice(start, end);
    },
    loadMorePosts() {
      this.currentPage++;
      this.updateDisplayedPosts();
    },
    openPostDetails(index) {
      this.selectedPost = this.displayedPosts[index];
    },
    closeModal() {
      this.selectedPost = null;
    },
    async likePost(postId) {
      try {
        const response = await axios.post(`http://localhost:5000/api/posts/like/${postId}`, { username: this.newPost.username });
        const index = this.posts.findIndex(post => post._id === postId);
        this.$set(this.posts, index, response.data.post);
        this.updateDisplayedPosts();
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
        
        // Update the comments in the selected post immediately
        if (this.selectedPost && this.selectedPost._id === postId) {
          this.selectedPost.comments.push(response.data.comment);
          this.commentTexts[postId] = ''; // Clear the input field
        }

        // Update the post list
        const index = this.posts.findIndex(post => post._id === postId);
        this.$set(this.posts, index, response.data.post);
        this.updateDisplayedPosts();

      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    },
    async fetchPosts() {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        this.posts = response.data;
        this.updateDisplayedPosts();
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
/* General Container Styles */
.create-post-container {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.create-post-container h2 {
  margin-bottom: 15px;
}

.create-post-container input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.create-post-container .btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-post-container .btn:hover {
  background-color: #0056b3;
}

/* Posts Grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Flexible columns */
  gap: 20px;
  margin: 20px;
}

.post {
  padding: 15px; /* Reduce padding for better fit on mobile */
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.post h3 {
  margin-bottom: 10px;
  font-size: 1.2em; /* Adjust font size */
}

.post p {
  margin-bottom: 15px;
  font-size: 1em; /* Adjust font size */
}

.post button {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.post button:hover {
  background-color: #218838;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr; /* Stack posts in one column */
  }

  .post {
    margin: 10px; /* Adjust margin for mobile */
  }

  .post h3 {
    font-size: 1.1em; /* Adjust font size */
  }

  .post p {
    font-size: 0.9em; /* Adjust font size */
  }

  .post button {
    width: 100%; /* Make buttons full width */
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .post {
    padding: 10px; /* Further reduce padding */
  }

  .post h3 {
    font-size: 1em; /* Further adjust font size */
  }

  .post p {
    font-size: 0.9em;
  }

  .post button {
    font-size: 0.9em; /* Adjust button font size */
  }
}

/* Load More Button */
button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #5a6268;
}

/* Modal Styles *//* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  position: relative;
  max-height: 80vh; /* Adjust the max height of the modal */
  overflow: hidden; /* Hide any content that exceeds the max height */
}

.modal-content h3 {
  margin-bottom: 10px;
}

.modal-content p {
  margin-bottom: 15px;
}

.modal-description {
  max-height: 200px; /* Set a max height for the description area */
  overflow-y: auto; /* Enable vertical scrolling if the content exceeds the max height */
}

.modal-content .close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.modal-content .like-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-content .like-btn:hover {
  background-color: #0056b3;
}

.modal-content .comment-section {
  margin-top: 20px;
}

.modal-content .comment-section input {
  width: calc(100% - 110px); /* Adjust width considering button width */
}

.modal-content .comment-section button {
  width: 100px;
  margin-left: 10px;
}

</style>
