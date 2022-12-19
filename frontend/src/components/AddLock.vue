<template>
    <TopHeader />
    <div class="add-lock-container">
        <h1>Add a New Lock</h1>
        <div class="addLock-form-container">
            <form @submit.prevent="addLock" class="addLock-form">
                <input id="name" v-model="name" type="text" required placeholder="Name">
                <input id="password" v-model="password" type="password" required placeholder="Password">
                <input id="passwordCorfim" v-model="passwordCorfim" type="password" required
                    placeholder="Confirm Password">
                <button v-on:click="addLock">Add Lock</button>
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
@media screen and (min-width: 768px) {
    .add-lock-container{
        width: 50%;
    }
    
}

@media screen and (max-width: 768px) {
    .add-lock-container{
        width: 85%;
    }
    
}
.add-lock-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.addLock-form {
    width: 300px;
    margin: 0 auto;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

label {
    margin-bottom: 5px;
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
</style>