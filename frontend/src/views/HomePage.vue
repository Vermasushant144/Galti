<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero">
      <h1 class="hero-heading">Learn from Failures</h1>
      <p class="hero-subheading">
        Share your experiences and help others avoid the same mistakes. Let's grow together!
      </p>
      <button class="cta-button" @click="goToShareStory">Share Your Story</button>
    </section>

    <!-- Most Liked Post Section -->
    <section class="most-liked-post">
      <h2>Most Liked Post of the Day</h2>
      <div v-if="mostLikedPost">
        <h3>{{ mostLikedPost.title }}</h3>
        <p>{{ mostLikedPost.description }}</p>
        <p><strong>Posted by:</strong> {{ mostLikedPost.username }}</p>
        <p><strong>Likes:</strong> {{ mostLikedPost.likes.length }}</p>
      </div>
      <p v-else>No posts have been liked today.</p>
    </section>

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

    <!-- Share Your Story Section -->
    <section class="share-story">
      <h2>Have a Story to Share?</h2>
      <p>Help others by sharing your experience. Your story might just be what someone needs to hear.</p>
      <button class="cta-button" @click="goToShareStory">Share Your Story Now</button>
    </section>

    <!-- Post Details Modal -->
    <div v-if="selectedPost" class="modal">
      <div class="modal-content">
        <h3>{{ selectedPost.title }}</h3>
        <!-- Show the full description in the modal -->
        <p>{{ selectedPost.description }}</p>
        <p><strong>Posted by:</strong> {{ selectedPost.username }}</p>
        <button @click="likePost(selectedPost._id)">Like ({{ selectedPost.likes.length }})</button>

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
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      recentStories: [],
      posts: [],
      displayedPosts: [],
      selectedPost: null,
      hasMorePosts: true,
      currentPage: 0,
      postsPerPage: 5,
      commentTexts: {},
      newPost: {
        username: '',
        title: '',
        description: ''
      },
      mostLikedPost: null
    };
  },
  methods: {
    goToShareStory() {
      // Navigate to the share story page (Replace with actual route if using Vue Router)
      this.$router.push('/post-create');
    },
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
    truncateDescription(description, maxLength) {
      return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
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
        this.calculateMostLikedPost(); // Update the most liked post after liking
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
        const index = this.posts.findIndex(post => post._id === postId);
        this.$set(this.posts, index, response.data.post);
        this.updateDisplayedPosts();
        this.commentTexts[postId] = '';
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
        this.calculateMostLikedPost(); // Calculate the most liked post on initial fetch
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    },
    calculateMostLikedPost() {
      const now = new Date();
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
      
      // Filter posts liked within the past day
      const recentPosts = this.posts.filter(post => {
        return post.likes.some(like => new Date(like.timestamp) >= oneDayAgo);
      });

      // Find the post with the most likes
      this.mostLikedPost = recentPosts.reduce((max, post) => {
        return post.likes.length > (max?.likes.length || 0) ? post : max;
      }, null);
    }
  },
  mounted() {
    this.fetchPosts();
  }
};
</script>

<style scoped>
/* Basic Styling */
.homepage {
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* Hero Section */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  background: #3498db;
  color: white;
  text-align: center;
  animation: fadeIn 2s;
}

.hero-heading {
  font-size: 3rem;
  margin-bottom: 10px;
  animation: slideInFromTop 1.5s;
}

.hero-subheading {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.cta-button {
  padding: 10px 30px;
  font-size: 1.2rem;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #005f99;
}

/* Most Liked Post Section */
.most-liked-post {
  padding: 50px 20px;
  background: #f5f5f5;
  text-align: center;
}

/* Posts Grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px;
}

.post {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.post h3 {
  margin-bottom: 10px;
}

.post p {
  margin-bottom: 15px;
}

.post button {
  padding: 8px 16px;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.post button:hover {
  background-color: #005f99;
}

/* Share Story Section */
.share-story {
  padding: 50px 20px;
  background: linear-gradient(135deg, #0099ff, #66ccff);
  color: white;
  text-align: center;
}

.share-story h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.share-story p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

/* Modal for Post Details */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 30px;
  width: 80%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.comment-section {
  margin-top: 20px;
}

.comment-section input {
  width: calc(100% - 100px);
  padding: 8px;
  margin-right: 10px;
}

.comment-section button {
  padding: 8px 16px;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-section button:hover {
  background-color: #005f99;
}

/* Load More Button */
button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #005f99;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromTop {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
