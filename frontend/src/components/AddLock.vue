<template>
    <TopHeader />
    <div class="form-page add-lock-container">
        <div class="form-container">
        <h1>Add a New Lock</h1>
            <form @submit.prevent="addLock" class="credentials-form">
                <input id="name" v-model="name" type="text" required placeholder="Name">
                <input id="password" v-model="password" type="password" required placeholder="Password">
                <input id="passwordCorfim" v-model="passwordCorfim" type="password" required
                    placeholder="Confirm Password">
                <button class="form-btn add-lock-btn" v-on:click="addLock">Add Lock</button>
            </form>
        </div>
    </div>
</template>

<script>
import TopHeader from './Header.vue'
import axios from 'axios'
import api_url from '../config'

export default {
    name: 'AddLock',
    components: {
        TopHeader
    },
    data() {
        return {
            name: '',
            password: '',
            passwordCorfim: ''
        }
    },
    methods: {
        addLock() {
            // Validate the form fields
            if (!this.name || !this.password || !this.passwordCorfim) {
                console.error('Name and password are required');
                return;
            }
            // verify that the passwords match
            if (this.password != this.passwordCorfim) {
                console.error('Passwords do not match');
                return;
            }
            // Send a request to the server to authenticate the user
            axios({
                method: 'post',
                url: api_url + '/locks/create',
                headers: { 'Authorization': localStorage.getItem('token') },
                data: { name: this.name, password: this.password, confirm_password: this.passwordCorfim }
            }).then(response => {
                if (response.status === 200) {
                    console.log("Lock added successfully");
                    this.$router.push('/home') // redirect to home page
                }
            }).catch(error => {
                if (error.response.status === 401) {
                    // Unauthorized, display error message
                    this.errorMessage = 'Invalid credentials'
                } else {
                    // Display error message
                    this.errorMessage = 'Something went wrong'
                }
            });
        }
    },
    mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem('token')) {
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>


.add-lock-btn {
  background-color: #ff9505;
  border: 1px solid #ff9505;
        width: 80%;
  
}

@media screen and (min-width: 450px) {
    .add-lock-btn{
        max-width: 300px;
    }
}

.add-lock-btn:hover {
  background-color: #ec4e20;
  border: 1px solid #ec4e20;
  color: #fff;
}
</style>