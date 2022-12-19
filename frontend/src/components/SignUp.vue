<template>
    <div class="signup-container">
        <div class="img-container">
            <img alt="UFSC logo" src="../assets/logo.png" class="img-logo-ufsc" />
        </div>
        <h1 class="signup-title">Sign Up</h1>
        <div class="signup-form-container">
            <form @submit.prevent="signup" class="signup-form">
                <input id="email" v-model="email" type="email" required placeholder="E-mail">
                <input id="password" v-model="password" type="password" required placeholder="Password">
                <input id="password_confirmation" v-model="confirmPassword" type="password" required
                    placeholder="Confirm Password">
                <button class="signup-btn" v-on:click="signup">Sign Up</button>
                <p>
                    <router-link to="/login" scroll-behavior="smooth">Already have an account? Login</router-link>
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
.signup-form-container {
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.signup-btn {
    width: 50%;
    background-color: #4CAF50;
    border-color: #4CAF50;
    color: white;
    cursor: pointer;
}

.signup-title {
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

.signup-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
}

label {
    margin-bottom: 5px;
}

@media screen and (min-width: 768px) {
    .signup-container {
        width: 50%;
    }

    .img-logo-ufsc {
        width: 35%;
    }
}

@media screen and (max-width: 768px) {
    .signup-container {
        width: 85%;
    }

    .img-logo-ufsc {
        width: 100%;
    }
}

.signup-container {
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
    border: 1px solid skyblue;
    background: skyblue;
    width: 50%;
    height: 40px;
    color: white;
    cursor: pointer;
    margin: 5px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 18px;
}

button:active {
    opacity: 0.8;
}

.login-link {
    text-align: center;
    width: 90%;
}
</style>
  
  