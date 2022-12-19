<template>
  <div class="form-page-container login-container">
    <img alt="UFSC logo" src="../assets/logo.png" class="imagestyle" />
    <div class="form-container">
      <h1 class="login-title">Login</h1>
      <form @submit.prevent="login" class="credentials-form">
        <input id="email" v-model="email" type="email" required placeholder="E-mail">
        <input id="password" v-model="password" type="password" required placeholder="Password">
        <div class="form-btn-container">
          <button class="form-btn login-btn" v-on:click="login">Login</button>
          <button class="form-btn signup-btn" v-on:click="register">Sign Up</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import VueJwtDecode from 'vue-jwt-decode'
import axios from 'axios'
import api_url from '../config'

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      // Validate the form fields
      if (!this.email || !this.password) {
        console.error('Email and password are required');
        return;
      }
      // Send a request to the server to authenticate the user
      axios.post(api_url + '/users/login', {
        email: this.email,
        password: this.password
      })
        .then(response => {
          if (response.status === 200) {
            // User was successfully authenticated
            localStorage.setItem('token', response.data.token)
            this.$router.push('/home') // redirect to home page
            //verify if the user is admin
            let decoded = VueJwtDecode.decode(response.data.token);
            if (decoded.admin) {
              localStorage.setItem('admin', true)
            }
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            // Unauthorized, display error message
            this.errorMessage = 'Invalid credentials'
          } else {
            // Display error message
            this.errorMessage = 'Something went wrong'
          }
        });
    },
    register() {
      // Redirect to the sign up page
      this.$router.push('/signup');
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


