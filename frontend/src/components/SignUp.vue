<template>
    <div class="img-container">
        <img alt="UFSC logo" src="../assets/logo.png" class="img-logo-ufsc" />
    </div>
    <h1>Sign Up</h1>
    <div class="signup-form">
        <form @submit.prevent="signup">
            <input id="name" v-model="name" type="text" required placeholder="Name">
            <input id="email" v-model="email" type="email" required placeholder="E-mail">
            <input id="password" v-model="password" type="password" required placeholder="Password">
            <button v-on:click="signup">Sign Up</button>
            <p>
                <router-link to="/login">Already have an account? Login</router-link>
            </p>
        </form>
    </div>
</template>
  
  
  
<script>
import axios from 'axios'
import api_url  from '../config'

export default {
    name: 'SignUp',
    data() {
        return {
            name: '',
            email: '',
            password: ''
        }
    },
    methods: {
        async signup() {
            // Validate the form fields
            if (!this.name || !this.email || !this.password) {
                console.error('Email and password are required');
                return;
            }
            await axios.post(api_url + '/users/login', {
                name: this.name,
                email: this.email,
                password: this.password
            }).then(response => {
                // handle success
                if (response.status === 201) {
                    // User was successfully created
                    localStorage.setItem('token', JSON.stringify(response.data.token))
                    this.$router.push('/home') // redirect to login page
                }
            }).catch(error => {
                // handle error
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
.signup-form {
    width: 300px;
    margin: 0 auto;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 5px;
}

input {
    width: 300px;
    height: 40px;
    padding-left: 20px;
    display: block;
    margin-bottom: 30px;
    margin-right: auto;
    margin-left: auto;
    border: 1px solid skyblue;
}

button {
    width: 320px;
    height: 40px;
    border: 1px solid skyblue;
    background: skyblue;
    color: white;
    cursor: pointer;
}
</style>
  
  