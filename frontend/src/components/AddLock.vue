<template>
    <TopHeader />
    <h1>Add a New Lock</h1>
    <div class="addLock-form">
        <form @submit.prevent="addLock">
            <input id="name" v-model="name" type="text" required placeholder="Name">
            <input id="password" v-model="password" type="password" required placeholder="Password">
            <input id="passwordCorfim" v-model="passwordCorfim" type="password" required placeholder="Confirm Password">
            <button style="display: flex; justify-content: center;" v-on:click="addLock">Add Lock</button>
        </form>
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
                data: { lockName: this.name, lockPassword: this.password }
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
.addLock-form {
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
    text-align: center;
}

button:active {
    opacity: 0.8;
}
</style>