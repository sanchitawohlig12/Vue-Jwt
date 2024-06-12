// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { loadFonts } from './plugins/webfontloader';
import 'vuetify/dist/vuetify.min.css'


loadFonts();

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
});

app.mount('#app');