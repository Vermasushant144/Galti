import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from '../src/store/store';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
// main.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


createApp(App).use(store).use(router).mount('#app');
