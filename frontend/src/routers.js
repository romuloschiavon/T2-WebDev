import {createRouter, createWebHistory} from 'vue-router'

import LoginForm from './components/Login.vue'
import SignUpForm from './components/SignUp.vue'
import HomePage from './components/HomePage.vue'

const routes = [
    {path: '/home', component: HomePage},
    {path: '/login', component: LoginForm},
    {path: '/signup', component: SignUpForm}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router