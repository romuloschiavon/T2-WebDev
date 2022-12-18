import { createRouter, createWebHistory } from 'vue-router'

import LoginForm from './components/Login.vue'
import SignUpForm from './components/SignUp.vue'
import HomePage from './components/HomePage.vue'
import EditLock from './components/EditLock.vue'
import AddLock from './components/AddLock.vue'

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomePage },
    { path: '/login', component: LoginForm },
    { path: '/signup', component: SignUpForm },
    { path: '/editlock', component: EditLock },
    { path: '/addlock', component: AddLock }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router