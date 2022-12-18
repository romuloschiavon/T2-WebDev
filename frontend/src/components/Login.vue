<template>
  <div class="img-container">
    <img alt="UFSC logo" src="../assets/logo.png" class="img-logo-ufsc"/>
  </div>
  <h1>Login</h1>
  <div class="login-form">
    <form @submit.prevent="login">
      <input id="email" v-model="email" type="email" required placeholder="E-mail">
      <input id="password" v-model="password" type="password" required placeholder="Password">
      <button v-on:click="login">Login</button>
      <button v-on:click="signup">Sign Up</button>
    </form>
  </div>
</template>


<script>
import axios from 'axios'
import  api_url  from '../config'
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
        // If the login was successful, store the user's token and redirect to the dashboard
        localStorage.setItem('token', JSON.stringify(response.data.token));
        this.$router.push('/home');
      })
      .catch(error => {
        console.error(error);
      });
    },
    signup() {
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


<style scoped>
.login-form {
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
    margin: 5px;
  }
</style>

