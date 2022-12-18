<template>
    <TopHeader />
    <h1>Available Locks</h1>
    <table>
        <tr>
            <th>Room</th>
            <th>Time period available</th>
        </tr>
        <tr v-for="lock in locks" :key="lock.id">
            <td>{{ lock.lockName }}</td>
            <td>{{ Date(lock.start_time).toLocaleString("pt-br") }}</td>
            <td>TO</td>
            <td>{{ Date(lock.end_time).toLocaleString("pt-br") }}</td>
            <td>
                <button id="open" v-on:click="open(lock.lockName)">Open</button>
            </td>
            <td>
                <button id="close" v-on:click="close(lock.lockName)">Close</button>
            </td>
            <td>
                <template v-if="userIsAdmin">
                    <button id="edit" v-on:click="edit">Edit</button>
                </template>
            </td>
        </tr>
    </table>
</template>

<script>
import TopHeader from './Header.vue'
import axios from 'axios'
import api_url from '../config'

export default {
    name: 'HomePage',
    data() {
        return {
            locks: []
        }
    },
    components: {
        TopHeader
    },
    created() {
        // Check if the user is an admin
        if (localStorage.getItem('admin') === 'true') {
            this.userIsAdmin = true;
        }
        else {
            this.userIsAdmin = false;
        }
    },
    methods: {
        open(name) {
            // Send a request to the server to open the lock
            axios({
                method: 'post',
                url: api_url + '/locks/lockControl',
                headers: { 'Authorization': localStorage.getItem('token') },
                data: { lockName: name, status: 'open' }
            }).then(response => {
                if (response.status === 200) {
                    // Lock was successfully opened
                    console.log('Lock was successfully opened');
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
        close(name) {
            // Send a request to the server to close the lock
            axios({
                method: 'post',
                url: api_url + '/locks/lockControl',
                headers: { 'Authorization': localStorage.getItem('token') },
                data: { lockName: name, status: 'close' }
            }).then(response => {
                    if (response.status === 200) {
                        // Lock was successfully closed
                        console.log('Lock was successfully closed');
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
        edit() {
            this.$router.push('/editlock');
        }
    },
    async mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem('token')) {
            this.$router.push('/login');
        }
        // Get the list of locks
        let result = await axios.get(api_url + '/dashboard', { headers: { 'Authorization': localStorage.getItem('token') } });
        this.locks = result.data;
        console.log(this.locks);
    }
}
</script>

<style>
button {
    border-radius: 12px;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}

button:active {
    opacity: 0.8;
}

#open {
    background-color: #4CAF50;
    border: 1px solid #4CAF50;
    color: darkgreen;
}

#close {
    background-color: #f44336;
    border: 1px solid #f44336;
    color: darkred;
}
#edit {
    background-color: #2196F3;
    border: 1px solid #2196F3;
    color: darkblue;
}
</style>