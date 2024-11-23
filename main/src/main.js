import './assets/main.css'
import microApp from '@micro-zoe/micro-app'
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import pComponents from '@PComponents'

import App from './App.vue'
import router from './router'


const app = createApp(App)
microApp.start()
app.use(createPinia())
app.use(router)
app.use(TDesign)
app.use(pComponents)
app.mount('#app')
