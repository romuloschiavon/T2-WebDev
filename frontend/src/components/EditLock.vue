<template>
    <TopHeader />
    <h1>Edit Lock: {{ lock }}</h1>
    <div class="editLock-form">
        <form @submit.prevent="addLock">
            <div class="edit-lock">
                <label for="name">Name:</label>
                <input id="name" v-model="name" type="text" required placeholder="Edit Name">
                <button v-on:click="editLockName">Save New Name</button>
                <br />
            </div>
        </form>
        <form>
            <div class="edit-lock">
                <label for="name">Name:</label>
                <input id="name" v-model="name" type="text" required placeholder="Lock Name">
                <label for="password">New Password:</label>
                <input id="password" v-model="password" type="password" required placeholder="New Password">
                <input id="passwordCorfim" v-model="passwordCorfim" type="password" required
                    placeholder="Confirm Password">
                <button v-on:click.prevent="editLockPassword">Save New Password</button>
            </div>
            <button id="delete" v-on:click="deleteLock">Delete Lock</button>
        </form>
    </div>
    <div class="usersLock-table">
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Access</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in usersInfo[Object.keys(usersInfo)[0]]" v-bind:key="user.email">
                    <td>{{ user.email }}</td>
                    <td>from</td>
                    <td>{{ convertToLocale(user.start_time) }}</td>
                    <td>to</td>
                    <td>{{ convertToLocale(user.end_time) }}</td>
                    <td>
                        <button id="delete" v-on:click="deleteUser(user)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="new-user">
        <label for="email">E-mail:</label>
        <input id="email" v-model="email" type="email" required placeholder="E-mail">
        <label for="start_time">Start Time:</label>
        <input id="start_time" v-model="start_time" type="datetime-local" required>
        <label for="end_time">End Time:</label>
        <input id="end_time" v-model="end_time" type="datetime-local" required>
        <button v-on:click="addNewUser">Add New User</button>
        <br />
    </div>
</template>

<script>
import TopHeader from './Header.vue'
import axios from 'axios'
import api_url from '../config'

export default {
    name: 'EditLock',
    components: {
        TopHeader
    },
    data() {
        return {
            lock: localStorage.getItem('lockName'),
            name: '',
            password: '',
            passwordCorfim: '',
            email: '',
            start_time: '',
            end_time: '',
            usersInfo: []
        }
    },
    methods: {
        editLockName() {
            axios({
                method: 'post',
                url: api_url + '/locks/updateName',
                headers: { 'Authorization': localStorage.getItem('token') },
                data: { oldLockName: localStorage.getItem('lockName'), newLockName: this.name }
            }).then(response => {
                if (response.status === 200) {
                    console.log("Lock name edited successfully");
                    this.$router.push('/home') // refresh page
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

        },
        editLockPassword() {
            const data = {
                lockName: localStorage.getItem('lockName'),
                lockPassword: this.password
            }
            console.log(data)
            // verify that the password is the same in both fields
            if (this.password !== this.passwordCorfim) {
                this.errorMessage = 'Passwords do not match'
                return
            }
            //send the request to the server to edit the lock password
            axios({
                method: 'post',
                url: api_url + '/locks/updatePassword',
                headers: { 'Authorization': localStorage.getItem('token') },
                data: { lockName: localStorage.getItem('lockName'), lockPassword: this.password }
            }).then(response => {
                if (response.status === 200) {
                    console.log("Lock password edited successfully");
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
        },
        deleteLock() {
            //send the request to the server to delete the lock
            axios({
                method: 'post',
                url: api_url + '/locks/remove',
                headers: { 'Authorization': localStorage.getItem('token') },
                data: { lockName: localStorage.getItem('lockName') }
            }).then(response => {
                if (response.status === 200) {
                    console.log("Lock deleted successfully");
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
        },
        addNewUser() {
            const start = new Date(Date.parse(this.start_time));
            const end = new Date(Date.parse(this.end_time));
            const start_time = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const end_time = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            axios({
                method: 'post',
                url: api_url + '/usersLocks/updateLock',
                headers: { 'Authorization': localStorage.getItem('token') },
                data: {
                    email: this.email,
                    lockName: localStorage.getItem('lockName'),
                    start_time: start_time,
                    end_time: end_time
                }
            }).then(response => {
                if (response.status === 200) {
                    console.log("User added successfully");
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
        },
        deleteUser(user) {
            const start = new Date(Date.parse(user.start_time));
            const end = new Date(Date.parse(user.end_time));
            const start_time = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const end_time = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            axios({
                method: 'post',
                url: api_url + '/usersLocks/removeLock',
                headers: { 'Authorization': localStorage.getItem('token') },
                data: {
                    email: user.email,
                    lockName: localStorage.getItem('lockName'),
                    start_time: start_time,
                    end_time: end_time
                }
            }).then(response => {
                if (response.status === 200) {
                    console.log("User deleted successfully");
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
        },
        convertToLocale(utcString) {
            const date = new Date(Date.parse(utcString));
            const localTimeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return localTimeString
        }
    },
    async mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem('token')) {
            this.$router.push('/login');
        }
        // let lockInfo = await axios({
        //     method: 'get',
        //     url: api_url + '/locks/' + this.$route.params.id,
        //     headers: { 'Authorization': localStorage.getItem('token') }
        // });

        let result = await axios({
            method: 'get',
            url: api_url + '/usersLocks/getLockUsers',
            headers: {
                'Authorization': await localStorage.getItem('token'),
                'lockName': await localStorage.getItem('lockName')
            },
            data: {}
        });
        this.usersInfo = result.data;
        console.log(this.usersInfo)
    }
}
</script>

<style>
.usersLock-table {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.edit-lock {
    display: flex;
    flex-direction: list-item;
    align-items: center;
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

#delete {
    background: red;
    border: 1px solid red;
}

button:active {
    opacity: 0.8;
}
</style>