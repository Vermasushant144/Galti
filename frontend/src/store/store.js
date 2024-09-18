import { createStore } from 'vuex';

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    isLoggedIn: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null, // Initialize user state
  },
  mutations: {
    SET_TOKEN(state, { token, user }) {
      state.token = token;
      state.isLoggedIn = !!token;
      state.user = user; // Set user data
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
    },
    LOGOUT(state) {
      state.token = '';
      state.isLoggedIn = false;
      state.user = null; // Clear user data
      localStorage.removeItem('token'); // Remove token from localStorage
      localStorage.removeItem('user'); // Remove user data from localStorage
    },
  },
  actions: {
    login({ commit }, { token, user }) {
      commit('SET_TOKEN', { token, user }); // Commit token and user data to Vuex store
    },
    logout({ commit }) {
      commit('LOGOUT'); // Commit logout to Vuex store
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn, // Check login status
    getToken: (state) => state.token, // Get the stored token
    getUser: (state) => state.user, // Get user data
  },
});
