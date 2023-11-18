import { createApp } from 'vue'
import './assets/style.sass'
import App from './App.vue'
import store from './store';

createApp(App).use(store).mount('#app');
