<template>
    <div class="feedback-container">
      <div class="feedback-card">
        <h2>Feedback</h2>
        <form @submit.prevent="submitFeedback" class="feedback-form">
          <input v-model="username" type="text" placeholder="Username" required class="input-field" />
          <input v-model="email" type="email" placeholder="Email" required class="input-field" />
          <textarea v-model="feedback" placeholder="Your feedback" required class="input-field"></textarea>
          <button type="submit" class="submit-button">Submit Feedback</button>
        </form>
        <p v-if="message" class="success-message">{{ message }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        feedback: '',
        message: '',
        errorMessage: ''
      };
    },
    methods: {
      async submitFeedback() {
        try {
          const response = await axios.post('http://localhost:5000/api/feedback/submit', {
            username: this.username,
            email: this.email,
            feedback: this.feedback
          });
          this.message = response.data.message;
          this.clearForm();
        } catch (err) {
          this.errorMessage = 'Failed to submit feedback. Please try again.';
        }
      },
      clearForm() {
        this.username = '';
        this.email = '';
        this.feedback = '';
      }
    }
  };
  </script>
  
  <style scoped>
  /* Feedback page styles */
  .feedback-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f0f0f0, #d9e4f5);
  }
  
  .feedback-card {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
    text-align: center;
  }
  
  .input-field {
    width: 100%;
    padding: 12px;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: border-color 0.3s;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #74ebd5;
  }
  
  .submit-button {
    width: 100%;
    padding: 12px;
    background: #74ebd5;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .submit-button:hover {
    background-color: #56c7b4;
  }
  
  .success-message {
    color: green;
    margin-top: 1rem;
  }
  
  .error-message {
    color: red;
    margin-top: 1rem;
  }
  </style>
  