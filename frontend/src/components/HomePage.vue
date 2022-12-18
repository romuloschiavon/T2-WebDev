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
                <button id="open" v-on:click="open">Open</button>
            </td>
            <td>
                <button id="close" v-on:click="close">Close</button>
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
    methods: {
        open() {
            // Send a request to the server to open the lock
            axios.post(api_url + '/locks/lockControl', {
                lockId: this.locks.lockName
            })
                .then(response => {
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
        close() {
            // Send a request to the server to close the lock
            axios.post(api_url + '/locks/lockControl', {
                lockId: this.locks.id
            })
                .then(response => {
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
        }
    },
    async mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem('token')) {
            this.$router.push('/login');
        }
        // Get the list of locks
        let result = await axios.get(api_url + '/dashboard', {headers: {'Authorization': localStorage.getItem('token')}});
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
button:active{
    opacity: 0.8;
}
#open {
    background-color: #4CAF50;
    border: 1px solid #4CAF50;
    color: darkgreen;
}
#close{
    background-color: #f44336;
    border: 1px solid #f44336;
    color: darkred;
}
</style>