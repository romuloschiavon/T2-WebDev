<template>
    <TopHeader />
    <div class="form-page-container add-new-lock-page-container">
        <div class="form-container">
            <h1>Add a New Lock</h1>
            <form @submit.prevent="addLock" class="credentials-form add-lock-form">
                <input id="name" v-model="name" type="text" required placeholder="Name">
                <input id="password" v-model="password" type="password" required placeholder="Password">
                <input id="passwordConfirm" v-model="passwordConfirm" type="password" required
                    placeholder="Confirm Password">
                <button class="form-btn add-lock-btn" v-on:click="addLock">Add Lock</button>
            </form>
        </div>
    </div>
</template>

<script>
import TopHeader from './Header.vue';
import axios from 'axios';
import api_url from '../config';
import Swal from "sweetalert2";

export default {
    name: 'AddLock',
    components: {
        TopHeader
    },
    data() {
        return {
            name: '',
            password: '',
            passwordConfirm: ''
        }
    },
    methods: {
        addLock() {
            // Validate the form fields
            if (!this.name || !this.password || !this.passwordConfirm) {
                console.error('Name and password are required');
                return;
            }
            // verify that the passwords match
            if (this.password != this.passwordConfirm) {
                console.error('Passwords do not match');
                return;
            }
            // Send a request to the server to authenticate the user
            axios({
                method: 'post',
                url: api_url + '/locks/create',
                headers: { 'Authorization': localStorage.getItem('token') },
                data: { name: this.name, password: this.password, confirm_password: this.passwordConfirm }
            }).then(response => {
                if (response.status === 200) {
                    Swal.fire(
                        'Lock added!',
                        'The lock was added successfully.',
                        'success'
                    )
                    console.log("Lock added successfully");
                    this.$router.push('/home') // redirect to home page
                }
            }).catch(error => {
                Swal.fire(
                    'Error!',
                    'Something went wrong.',
                    'error'
                )
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
    .add-lock-btn {
        max-width: 300px;
    }
}

.add-lock-btn:hover {
    background-color: #ec4e20;
    border: 1px solid #ec4e20;
    color: #fff;
}
.add-new-lock-page-container{
    display: flex;
    justify-content: center;
    align-items: center;
}
.add-lock-form{
    width: 55%;
}
</style>