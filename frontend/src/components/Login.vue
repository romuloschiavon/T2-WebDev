<template>
  <div class="login-container">
    <div class="img-container">
      <img alt="UFSC logo" src="../assets/logo.png" class="img-logo-ufsc" />
    </div>
    <h1 class="login-title">Login</h1>
    <div class="login-form-container">
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
.login-form-container {
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-title {
  text-align: center;
  width: 100%;
}

form {
  display: flex;
  flex-direction: column;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: center;
}

label {
  margin-bottom: 5px;
}

@media screen and (min-width: 600px) {
  .login-container {
    width: 50%;
  }

  .img-logo-ufsc {
    width: 35%;
  }
}

@media screen and (max-width: 600px) {
  .login-container {
    width: 85%;
  }

  .img-logo-ufsc {
    width: 60%;
  }

  .login-btn {
    background-color: #4CAF50;
    font-size: 1rem;
    transition: all 0.2s;
    color: #f1f1f1;
    width: 20vw;
    height: 6vh;
  }

  .login-btn:hover{
    font-size: 1rem;
    transition: all 0.2s;
    width: 20vw;
    height: 6vh;
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
    font-size: 1rem;
    transition: all 0.2s;
    width: 20vw;
    height: 6vh;
  }
}

.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

input {
  width: 100%;
  height: 40px;
  padding-left: 20px;
  display: block;
  margin-bottom: 30px;
  margin-right: auto;
  margin-left: auto;
  border: 1px solid skyblue;
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

.login-btn {
  background-color: #4CAF50;
  font-size: 1rem;
  transition: all 0.2s;
  color: #f1f1f1;
  width: 20vw;
  height: 6vh;
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
  width: 20vw;
  height: 6vh;
}

</style>

