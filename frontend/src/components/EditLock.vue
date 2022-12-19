<template>
    <TopHeader />
    <h1>Edit Selected Lock</h1>
    <div class="editLock-form">
        <form @submit.prevent="addLock">
            <input id="name" v-model="name" type="text" required placeholder="Edit Name">
            <input id="password" v-model="password" type="password" required placeholder="Edit Password">
            <input id="passwordCorfim" v-model="passwordCorfim" type="password" required placeholder="Confirm Password">
            <button v-on:click="editLock">Save Lock Changes</button>
            <button id="delete" v-on:click="deleteLock">Delete Lock</button>
        </form>
    </div>
    <div class="usersLock-table">
        <table>
            <tr>
                <th>UserName</th>
                <th>AcessTime</th>
            </tr>
            <tr v-for="user in usersInfo" :key="user.id">
                <td>{{ user.email }}</td>
                <td>{{ user.lockHistory.start_time.toLocaleString("pt-br") }}</td>
                <td>
                    <button v-on:click="editUser(user.email)">Edit</button>
                    <button id="delete" v-on:click="deleteUser(user.email, user.lockHistory.lockName)">Delete</button>
                </td>
            </tr>
        </table>
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
            usersInfo: []
        }
    },
    methods: {
        editLock() {
            console.log("editUser");
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
        // editUser(email) {
        //     console.log("editUser");
        // },
        deleteUser(email, lock) {
            let resp = {
                    email: email,
                    lockName: lock,
                    start_time: lock.start_time,
                    end_time: lock.end_time
                }
            console.log(resp);
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
    }
}
</script>

<style>
.usersLock-table {
    display: flex;
    flex-direction: column;
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