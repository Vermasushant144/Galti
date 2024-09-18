<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Growth-jourनि</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/Feedback">FeedBack</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/post-create">Post Create</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/posts">Own Post</router-link>
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <button class="nav-link profile-btn" @click="openProfileModal">Profile</button>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <button class="logout-btn" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="showProfileModal" class="modal">
      <div class="modal-content">
        <h3>User Profile</h3>
        <p v-if="user"><strong>Username:</strong> {{ user.username }}</p>
        <p v-if="user"><strong>Email:</strong> {{ user.email }}</p>
        <!-- Add other user details here -->

        <button @click="closeProfileModal">Close</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HomeWorld',
  data() {
    return {
      showProfileModal: false,
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getUser']),
    user() {
      return this.getUser;
    },
  },
  methods: {
    ...mapActions(['logout']),
    openProfileModal() {
      this.showProfileModal = true;
    },
    closeProfileModal() {
      this.showProfileModal = false;
    },
  },
};
</script>


<style scoped>
/* Navbar styles */
.navbar {
  background: linear-gradient(135deg, #11998e, #38ef7d);

  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

/* Brand animation */
.navbar-brand {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  animation: fadeIn 1s ease-in-out;
}

.navbar-brand:hover {
  color: #fff;
}

/* Navigation links */
.navbar-nav .nav-link {
  color: white;
  margin-right: 15px;
  position: relative;
  overflow: hidden;
  transition: color 0.3s ease;
}

/* Hover effect for nav links */
.navbar-nav .nav-link::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: -100%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.4s;
}

.navbar-nav .nav-link:hover::before {
  left: 0;
}

.navbar-nav .nav-link:hover {
  color: #0c7b62;
}

/* Logout button */
.logout-btn {
  padding: 8px 16px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  animation: fadeInUp 0.5s ease-in-out;
}

.logout-btn:hover {
  background-color: #ff6666;
}

/* Responsive styles */
@media (max-width: 768px) {
  .navbar-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .navbar-nav .nav-link {
    margin: 10px 0;
    width: 100%;
    text-align: center;
  }

  .logout-btn {
    width: 100%;
    margin-top: 10px;
  }
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

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
