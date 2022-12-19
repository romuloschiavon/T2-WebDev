import { createApp } from 'vue'
import App from './App.vue'
import router from './routers.js'
import './registerServiceWorker'

import 'material-icons/iconfont/material-icons.css';

createApp(App)
    .use(router)
    .mount('#app')
