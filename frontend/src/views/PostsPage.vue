<template>
  <div class="my-posts">
    <h2>My Posts</h2>

    <!-- User Posts Grid/List -->
    <div class="posts-grid">
      <div v-for="(post, index) in userPosts" :key="post._id" class="post">
        <h3>{{ post.title }}</h3>
        <p>{{ truncateDescription(post.description, 100) }}</p>
        <button @click="openPostDetails(index)">Read More</button>
        <button @click="editPost(post)">Edit</button>
        <button @click="deletePost(post._id)">Delete</button>
      </div>
    </div>

    <!-- Post Details Modal and other code remains the same -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userPosts: [],
      selectedPost: null,
      editMode: false,
      editPostData: {
        _id: '',
        title: '',
        description: '',
      },
      // Placeholder for current user ID
      currentUserId: 'user123', // Replace this with dynamic user ID fetching logic
    };
  },
  methods: {
    async fetchUserPosts() {
      try {
        // Pass the currentUserId to fetch posts created by the logged-in user
        const response = await axios.get('http://localhost:5000/api/posts/user', {
          params: { userId: this.currentUserId }, // Ensure backend expects this parameter
        });
        this.userPosts = response.data;
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
      }
    },
    // ... Other methods (openPostDetails, closeModal, editPost, etc.)
    async updatePost() {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/posts/update/${this.editPostData._id}`,
          this.editPostData
        );
        const index = this.userPosts.findIndex(
          (post) => post._id === this.editPostData._id
        );
        this.$set(this.userPosts, index, response.data);
        this.closeEditModal();
      } catch (error) {
        console.error('Failed to update post:', error);
      }
    },
    async deletePost(postId) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/delete/${postId}`);
        this.userPosts = this.userPosts.filter((post) => post._id !== postId);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    },
  },
  mounted() {
    this.fetchUserPosts();
  },
};
</script>

<style scoped>
/* Styles remain the same */
</style>
