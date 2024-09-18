<template>
  <div class="signup-container">
    <div class="signup-card">
      <h2>Signup</h2>
      <form @submit.prevent="registerUser" class="signup-form">
        <input v-model="username" type="text" placeholder="Username" required class="input-field" />
        <input v-model="email" type="email" placeholder="Email" required class="input-field" />
        <input v-model="password" type="password" placeholder="Password" required class="input-field" />
        <button type="submit" class="signup-button">Signup</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: ""
    };
  },
  methods: {
    async registerUser() {
      try {
        await axios.post("http://localhost:5000/api/auth/register", {
          username: this.username,
          email: this.email,
          password: this.password
        });
        this.$router.push("/login"); // Redirect to login page
      } catch (err) {
        console.error("Registration error:", err.response ? err.response.data : err.message);
        this.errorMessage = err.response ? err.response.data.error : "Something went wrong!";
      }
    }
  }
};
</script>

<style scoped>
/* Center the signup container */
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #74ebd5, #acb6e5); /* Background gradient */
}

/* Style the signup card */
.signup-card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: slideIn 0.5s ease-in-out;
}

/* Style for input fields */
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

/* Style the signup button */
.signup-button {
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

.signup-button:hover {
  background-color: #56c7b4;
}

/* Error message style */
.error-message {
  color: red;
  margin-top: 1rem;
  font-size: 14px;
}

/* Animation for signup card */
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Adding hover effect on input */
.input-field:hover {
  border-color: #acb6e5;
}

/* Adding focus animation on input */
.input-field:focus {
  animation: focusGlow 0.5s ease-in-out forwards;
}

@keyframes focusGlow {
  from {
    box-shadow: 0 0 5px #74ebd5;
  }
  to {
    box-shadow: 0 0 10px #74ebd5;
  }
}
</style>
