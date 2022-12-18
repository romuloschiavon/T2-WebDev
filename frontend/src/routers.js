import { createRouter, createWebHistory } from 'vue-router'

import LoginForm from './components/Login.vue'
import SignUpForm from './components/SignUp.vue'
import HomePage from './components/HomePage.vue'
import ManageLocks from './components/ManageLocks.vue'

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomePage },
    { path: '/login', component: LoginForm },
    { path: '/signup', component: SignUpForm },
    { path: '/managelocks', component: ManageLocks }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router