import './assets/main.css'
import microApp from '@micro-zoe/micro-app'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import paComponentsInstall from '../../components/vue'

import App from './App.vue'
import router from './router'


const app = createApp(App)
microApp.start()
app.use(createPinia())
app.use(router)
paComponentsInstall(app)
app.mount('#app')
