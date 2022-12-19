<template>
  <div class="login-container">
    <img alt="UFSC logo" src="../assets/logo.png" class="imagestyle"/>
    <div class="login-form-container">
      <h1 class="login-title">Login</h1>
      <form @submit.prevent="login" class="login-form">
        <input id="email" v-model="email" type="email" required placeholder="E-mail">
        <input id="password" v-model="password" type="password" required placeholder="Password">
        <button class="login-btn" v-on:click="login">Login</button>
        <button class="signup-btn" v-on:click="register">Sign Up</button>
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


<style scoped>

.login-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50vw;
  height: 80vh;
  max-width: 80%;
  max-height: 80%;
  margin-left: 22.5vw;
  margin-right: 22.5vw;
}

.login-form {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
}

.imagestyle {
  height: 40vh;
  width: auto;
}

input {
  width: 100%;
  height: 40px;
  padding-left: 20px;
  display: block;
  margin-bottom: 30px;
  margin-right: auto;
  margin-left: auto;
  border: 1px solid #353531;
  border-radius: 1rem;
}

@media (max-width: 780px) {
  .login-container {
    display: block;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0;
    margin-bottom: 0;
  }

  .login-form {
    flex-direction: column;
  }
}

button {
  display: flex;
  font-family: Ubuntu, sans-serif;
  border-radius: 0.3rem;
  padding: 3px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

button:active {
    transition: all 0.2s;
}

.login-form button:hover {
  transform: scale(1.1);
}

.login-btn {
  background-color: #FF9505;
  border: 1px solid #FF9505;
  font-size: 1rem;
  transition: all 0.2s;
  color: #f1f1f1;
  width: 20vw;
  height: 6vh;
}

.login-btn:hover {
  background-color: #EC4E20;
  border: 1px solid #EC4E20;
  font-size: 1rem;
  transition: all 0.2s;
  color: #fff;
}

.signup-btn {
  background-color: #016fb9;
  border: 1px solid #016fb9;
  font-size: 1rem;
  transition: all 0.2s;
  color: #f1f1f1;
  width: 20vw;
  height: 6vh;
}

.signup-btn:hover{
  background-color: #00548b;
  border: 1px solid #00548b;
  font-size: 1rem;
  transition: all 0.2s;
  color: #f1f1f1;
}

</style>

