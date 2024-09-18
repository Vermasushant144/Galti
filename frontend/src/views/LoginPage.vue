<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="loginUser" class="login-form">
        <input v-model="email" type="email" placeholder="Email" required class="input-field" />
        <input v-model="password" type="password" placeholder="Password" required class="input-field" />
        <button type="submit" class="login-button">Login</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p>Don't have an account? <router-link to="/signup">Register here</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: ""
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email: this.email,
          password: this.password
        });
        
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Redirect to the homepage
        this.$router.push('/');
      } catch (err) {
        this.errorMessage = "Invalid credentials!";
      }
    }
  }
};
</script>


<style scoped>
/* Center the login container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #74ebd5, #acb6e5); /* Background gradient */
}

/* Style the login card */
.login-card {
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

/* Style the login button */
.login-button {
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

.login-button:hover {
  background-color: #56c7b4;
}

/* Error message style */
.error-message {
  color: red;
  margin-top: 1rem;
  font-size: 14px;
}

/* Animation for login card */
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

/* Link style */
a {
  color: #74ebd5;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
