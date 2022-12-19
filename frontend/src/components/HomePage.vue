<template>
    <TopHeader />
    <div class="home-container">
        <h1 class="page-header">Available Locks</h1>
        <div class="table-container">
            <table class="room-table">
                <tr class="room-table-header">
                    <th>Room</th>
                    <th>Access Time</th>
                    <th>Actions</th>
                </tr>
                <tr v-for="lock in locks" :key="lock.id" class="room-table-row">
                    <td class="room-column">{{ lock.lockName }}</td>
                    <td class="time-frame-column">
                        <table class="time-frame-table">
                            <tr v-for="time in lock.time_frames" :key="time.id" class="time-frame-row">
                                <td>from {{ convertToLocale(time.start_time) }} to {{ convertToLocale(time.end_time) }}
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td class="actions-column">
                        <div class="button-container">
                            <button class="open-btn" v-on:click="open(lock.lockName)">Open</button>
                            <button class="close-btn" v-on:click="close(lock.lockName)">Close</button>
                            <template v-if="userIsAdmin">
                                <button class="edit-btn" v-on:click="edit(lock.lockName)">Edit</button>
                            </template>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
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
        edit(name) {
            localStorage.setItem('lockName', name)
            this.$router.push('/editlock');
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
        // Get the list of locks
        let result = await axios.get(api_url + '/dashboard', { headers: { 'Authorization': localStorage.getItem('token') } });
        this.locks = result.data;
    }
}
</script>

<style>
.time-frame-row{
    width: 100%;
}
.room-column {
    width: 30%;
    background-color: white;
}

.time-frame-column {
    width: 60%;
    background-color: white;
}

.actions-column {
    width: 10%;
    background-color: white;
}

.page-header {
    text-align: center;
    font-size: 30px;
    margin-top: 20px;
    width: 100%;
}

/* se estiver em uma tela media ou grande, o tamanho do home container é 70%, senão é 100% */
@media screen and (min-width: 768px) {
    .home-container {
        width: 70%;
    }
}

@media screen and (max-width: 768px) {
    .home-container {
        width: 100%;
    }
}

.home-container {
    margin: auto;
}

.button-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

table.time-frame-table {
    /* Coloca a largura em 90% e quebra a linha caso seja grande demais */
    width: 100%;
    table-layout: fixed;
    word-wrap: break-word;

}



.table-container {
    display: flex;
    justify-content: center;
    width: 100%;
}




table.room-table {
    width: 100%;
    background-color: #aaaaaa;
}

button {
    border-radius: 12px;
    padding: 3px 4px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}

button:active {
    opacity: 0.8;
}

.open-btn {
    background-color: #4CAF50;
    border: 1px solid #4CAF50;
    color: darkgreen;
    width: 60px;
}

.close-btn {
    background-color: #f44336;
    border: 1px solid #f44336;
    width: 60px;
}

.edit-btn {
    background-color: #2196F3;
    border: 1px solid #2196F3;
    color: darkblue;
    width: 60px;
}
</style>