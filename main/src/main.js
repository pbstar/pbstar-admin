import './assets/main.css'
import microApp from '@micro-zoe/micro-app'
import TDesign from 'tdesign-vue-next';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'tdesign-vue-next/es/style/index.css';
microApp.start()
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(TDesign);
app.mount('#app')
