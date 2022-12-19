<template>
    <TopHeader />
    <div class="form-page-container edit-lock-page-container">
        <h1>Edit Lock: <a class="lock-name-style">{{ lock }}</a></h1>
        <div  @submit.prevent="editLockName" class="form-container edit-form-container">
            <form class="credentials-form edit-lock-form" @submit.prevent="addLock">

                <label for="name">New Name:</label>
                <input id="name" v-model="name" type="text" required placeholder="Lock Name">
                <div class="form-btn-container">
                    <button class="form-btn edit-lock-btn " >Save New Name</button>
                </div>
            </form>
        </div>


        <div class="form-container edit-form-container">
            <form  class="credentials-form edit-lock-form">

                <label for="password">New Password:</label>
                <input id="password" v-model="password" type="password" required placeholder="New Password">
                <input id="passwordConfirm" v-model="passwordConfirm" type="password" required
                    placeholder="Confirm Password">


                <div class="form-btn-container">

                    <button class="form-btn edit-lock-btn" v-on:click.prevent="editLockPassword">Save New
                        Password</button>
                    <button class="form-btn edit-lock-btn delete-lock-btn" id="delete" v-on:click="deleteLock">Delete Lock</button>
                </div>
            </form>
        </div>
        <div class="table-container">
            <div class="usersLock-table">
                <table class="lock-table">
                    <thead>
                        <tr class="room-table-header">
                            <th>Email</th>
                            <th>Access</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="room-table-row" v-for="user in usersInfo[Object.keys(usersInfo)[0]]" v-bind:key="user.email">
                            <td class="email-column">{{ user.email }}</td>
                            <td class="time-frame-column">
                                {{ convertToLocale(user.start_time) }}
                                <span class="material-icons">arrow_forward</span>
                                {{ convertToLocale(user.end_time) }}
                            </td>
                            <td class="actions-column">
                                <div class="button-container">
                                    <button id="delete" class="form-btn edit-lock-btn delete-btn action-delete-brn" v-on:click="deleteUser(user)">Delete</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="form-container edit-form-container">
            <form action="" class="credentials-form edit-lock-form">
                <label for="email">E-mail:</label>
                <input id="email" v-model="email" type="email" required placeholder="E-mail">
                <label for="start_time">Start Time:</label>
                <input id="start_time" v-model="start_time" type="datetime-local" required>
                <label for="end_time">End Time:</label>
                <input id="end_time" v-model="end_time" type="datetime-local" required>
                <div class="form-btn-container">
                    <button class="form-btn edit-lock-btn " v-on:click="addNewUser">Add New User</button>
                </div>
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
    name: 'EditLock',
    components: {
        TopHeader
    },
    data() {
        return {
            lock: localStorage.getItem('lockName'),
            name: '',
            password: '',
            passwordConfirm: '',
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
                    Swal.fire(
                        'Lock Name Edited!',
                        'The lock name was edited successfully',
                        'success'
                    )
                    console.log("Lock name edited successfully");
                    this.$router.push('/home') // refresh page
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

        },
        editLockPassword() {
            const data = {
                lockName: localStorage.getItem('lockName'),
                lockPassword: this.password
            }
            console.log(data)
            // verify that the password is the same in both fields
            if (this.password !== this.passwordConfirm) {
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
                    Swal.fire(
                        'Password Edited!',
                        'The lock password was edited successfully',
                        'success'
                    )
                    console.log("Lock password edited successfully");
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
                    Swal.fire(
                        'Lock Deleted!',
                        'The lock was deleted successfully',
                        'success'
                    )
                    console.log("Lock deleted successfully");
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
                    Swal.fire(
                        'User Added!',
                        'The user was added successfully',
                        'success'
                    )
                    console.log("User added successfully");
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
                    Swal.fire(
                        'User Deleted!',
                        'The user was deleted successfully',
                        'success'
                    )
                    console.log("User deleted successfully");
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

<style scoped>
.edit-lock-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
}

.edit-lock-form {
    width: 50%;
}

.edit-form-container {
    /* coloca uma borda pra fazer uma separação */
    border: 1px solid #ccc;

}

.edit-lock-page-container {
    width: 80vw;
    display: flex;
    flex-direction: column;
    max-height: none;
    margin-left: 10vw;
    margin-right: 10vw;    
}

.edit-lock-btn {
    background-color: #016fb9;
    border: 1px solid #016fb9;
    color: #f1f1f1;
}

.edit-lock-btn:hover {
    background-color: #00548b;
    border: 1px solid #00548b;
    color: #fff;
}

.delete-lock-btn {
    background-color: #f44336;
    border: 1px solid #f44336;
    color: #f1f1f1;
}

.delete-lock-btn:hover {
    background-color: #a02c23;
    border: 1px solid #a02c23;
    color: #fff;
}

.delete-btn {
    background-color: #f44336;
    border: 1px solid #f44336;
    color: #f1f1f1;
}
.action-delete-brn{
    font-size: 0.8rem;
}

.delete-btn:hover {
    transition: all 0.2s;
    background-color: #a02c23;
    border: 1px solid #a02c23;
}
.table-container{
    background-color: #f1f1f1;
    color: #353531;
    display: flex;
    justify-content: center;
    width: 100%;
    height: auto;
}

.table-container th {
    font-family: Poppins, sans-serif;
    font-size: 1.2rem;
}

table.lock-table {
    width: 100%;
}

.email-column {
    width: 30%;
    background-color: #f1f1f1;
    color: #353531;
    font-family: Ubuntu, sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
}

.time-frame-column {
    width: 60%;
    background-color: #f1f1f1;
}

.actions-column {
    width: 10%;
    background-color: #f1f1f1;
}

.edit-lock-form label{
    margin-top: 2vh;
    padding: 0;
    margin-bottom: 0;
}

@media screen and (max-width: 768px) {
    .edit-lock-form {
        width: 100%;
    }
    .edit-lock-page-container{
        margin-bottom: 1vh;
    }

    input{
        width: 10vw;
    }

    .table-container{
        background-color: #f1f1f1;
        color: #353531;
        display: flex;
        justify-content: center;
        width: 100%;
        height: auto;
    }

    .table-container th {
        font-family: Poppins, sans-serif;
        font-size: 1rem;
    }
}

.edit-lock-form button{
    margin-top: 0;
    margin-bottom: 2vh;
}

.edit-lock-page-container{
    margin-bottom: 10vh;
}

.lock-name-style{
    color: #016fb9;
}
</style>