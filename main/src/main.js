import './assets/main.css'
import WujieVue from "wujie-vue3";
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import pComponents from '../../components'

import App from './App.vue'
import router from './router'


const app = createApp(App)
app.use(createPinia())
app.use(WujieVue)
app.use(router)
app.use(TDesign)
app.use(pComponents)
app.mount('#app')
