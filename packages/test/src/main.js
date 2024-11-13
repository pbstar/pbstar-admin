import './assets/main.css'
import microApp from '@micro-zoe/micro-app'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import pComponents from '../../../components/vue'

import App from './App.vue'
import router from './router'

microApp.start()
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(pComponents)
app.mount('#app')
