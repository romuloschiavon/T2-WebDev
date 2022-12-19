import { createApp } from 'vue'
import App from './App.vue'
import router from './routers.js'
import './registerServiceWorker'



createApp(App)
    .use(router)
    .mount('#app')
