import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import PostCreatePage from '@/views/PostCreatePage.vue';
import FeedbackPage from '@/views/FeedBackPage.vue'; // Corrected the import
import PostsPage from '@/views/PostsPage.vue';

// Define the routes
const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/login', component: LoginPage, meta: { guest: true } },  // Only accessible by guests
  { path: '/signup', component: SignupPage, meta: { guest: true } },  // Only accessible by guests
  { path: '/post-create', component: PostCreatePage, meta: { requiresAuth: true } }, // Protected route
  { path: '/Feedback', component: FeedbackPage } ,// Added missing comma and corrected path
  { path: '/posts', component: PostsPage }
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for protecting routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');  // Check for the token

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the route requires authentication and there's no token, redirect to login
    if (!token) {
      next('/login');
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    // If the route is for guests and the user is logged in, redirect to homepage
    if (token) {
      next('/');
    } else {
      next();
    }
  } else {
    next();  // Continue if the route doesn't require auth
  }
});

export default router;
