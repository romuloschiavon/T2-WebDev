<template>
    <div class="form-page-container credential-page-container">
        <img alt="UFSC logo" src="../assets/logo.png" class="imagestyle" />
        <div class="form-container">
        <h1 class="signup-title">Sign Up</h1>
            <form @submit.prevent="signup" class="credentials-form">
                <input id="email" v-model="email" type="email" required placeholder="E-mail">
                <input id="password" v-model="password" type="password" required placeholder="Password">
                <input id="password_confirmation" v-model="confirmPassword" type="password" required
                    placeholder="Confirm Password">
                <button class="form-btn signup-btn" v-on:click="signup">Sign Up</button>
                <p>
                    <router-link to="/login" class="link-to-login" scroll-behavior="smooth">Already have an account? Login</router-link>
                </p>
            </form>
        </div>
    </div>
</template>
  
  
  
<script>
import axios from 'axios';
import api_url from '../config';
import Swal from "sweetalert2";

export default {
    name: 'SignUp',
    data() {
        return {
            email: '',
            password: '',
            confirmPassword: ''
        }
    },
    methods: {
        async signup() {
            // Validate the form fields
            if (!this.email || !this.password || !this.confirmPassword) {
                console.error('Email and password are required');
                return;
            }
            await axios.post(api_url + '/users/register', {
                email: this.email,
                password: this.password,
                confirm_password: this.confirmPassword
            }).then(response => {
                // handle success
                if (response.status === 201) {
                    Swal.fire(
                        'New user created!',
                        'You have successfully signed up!',
                        'success'
                    )
                    // User was successfully created
                    localStorage.setItem('token', response.data.token)
                    this.$router.push('/home') // redirect to login page
                }
            }).catch(error => {
                // handle error
                Swal.fire(
                    'Error!',
                    'Something went wrong.',
                    'error'
                )
                if (error.response.status === 400) {
                    // Bad request, display error message
                    this.errorMessage = 'Invalid input'
                } else if (error.response.status === 409) {
                    // Conflict, display error message
                    this.errorMessage = 'Email already in use'
                } else {
                    // Other error, display generic error message
                    this.errorMessage = 'An error occurred'
                }
            })
        }
    },
    mounted() {
        // If the user is already logged in, redirect to the dashboard
        if (localStorage.getItem('token')) {
            this.$router.push('/home');
        }
    }
}
</script>
<style scoped>


.link-to-login {
    font-family: 'Ubuntu', sans-serif;
    text-decoration: none;
    color: #353531;
    cursor: pointer;
}
.link-to-login:hover {
    color: #000;
    text-decoration: underline;
}
</style>