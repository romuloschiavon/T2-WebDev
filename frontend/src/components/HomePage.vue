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
                                <td class="times">
                                    {{ convertToLocale(time.start_time) }}
                                    <span class="material-icons">arrow_forward</span>
                                    {{ convertToLocale(time.end_time) }}
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td class="actions-column">
                        <div class="button-container">
                            <button class="open-btn" v-on:click="open(lock.lockName)">
                                Open
                            </button>
                            <button class="close-btn" v-on:click="close(lock.lockName)">
                                Close
                            </button>
                            <template v-if="userIsAdmin">
                                <button class="edit-btn" v-on:click="edit(lock.lockName)">
                                    Edit
                                </button>
                            </template>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import TopHeader from "./Header.vue";
import axios from "axios";
import api_url from "../config";

export default {
    name: "HomePage",
    data() {
        return {
            locks: [],
        };
    },
    components: {
        TopHeader,
    },
    created() {
        // Check if the user is an admin
        if (localStorage.getItem("admin") === "true") {
            this.userIsAdmin = true;
        } else {
            this.userIsAdmin = false;
        }
    },
    methods: {
        open(name) {
            // Send a request to the server to open the lock
            axios({
                method: "post",
                url: api_url + "/locks/lockControl",
                headers: { Authorization: localStorage.getItem("token") },
                data: { lockName: name, status: "open" },
            })
                .then((response) => {
                    if (response.status === 200) {
                        // Lock was successfully opened
                        console.log("Lock was successfully opened");
                    }
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        // Unauthorized, display error message
                        this.errorMessage = "Invalid credentials";
                    } else {
                        // Display error message
                        this.errorMessage = "Something went wrong";
                    }
                });
        },
        close(name) {
            // Send a request to the server to close the lock
            axios({
                method: "post",
                url: api_url + "/locks/lockControl",
                headers: { Authorization: localStorage.getItem("token") },
                data: { lockName: name, status: "close" },
            })
                .then((response) => {
                    if (response.status === 200) {
                        // Lock was successfully closed
                        console.log("Lock was successfully closed");
                    }
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        // Unauthorized, display error message
                        this.errorMessage = "Invalid credentials";
                    } else {
                        // Display error message
                        this.errorMessage = "Something went wrong";
                    }
                });
        },
        edit(name) {
            localStorage.setItem("lockName", name);
            this.$router.push("/editlock");
        },
        convertToLocale(utcString) {
            const date = new Date(Date.parse(utcString));
            const localTimeString = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            return localTimeString;
        },
    },
    async mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem("token")) {
            this.$router.push("/login");
        }
        // Get the list of locks
        let result = await axios.get(api_url + "/dashboard", {
            headers: { Authorization: localStorage.getItem("token") },
        });
        this.locks = result.data;
    },
};
</script>

<style>
template {
    scroll-behavior: "smooth";
}

.time-frame-row {
    width: 100vw;
}

.room-column {
    width: 30%;
    background-color: white;
    color: #353531;
    font-family: Ubuntu, sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
}

.time-frame-column {
    width: 60vw;
    background-color: white;
}

.actions-column {
    width: 10%;
    background-color: white;
}

.page-header {
    font-family: Poppins, sans-serif;
    text-align: center;
    font-size: 2.4rem;
    margin-top: 3vh;
    width: 100%;
}

.times{
    font-size: 1rem;
}

.times span{
    font-size: 1rem;
}

/* se estiver em uma tela media ou grande, o tamanho do home container é 70%, senão é 100% */
@media screen and (min-width: 768px) {
    .home-container {
        width: 70vw;
    }
}

@media screen and (max-width: 768px) {
    .home-container {
        width: 100%;
    }
}

.home-container {
    margin: auto;
    margin-bottom: 5vh;
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
    background-color: #353531;
    color: #ff9505;
    display: flex;
    justify-content: center;
    width: 100%;
    height: auto;
}

.table-container th {
    font-family: Poppins, sans-serif;
    font-size: 1.2rem;
}

table.room-table {
    width: 100%;
}

button {
    display: flex;
    font-family: Ubuntu, sans-serif;
    border-radius: 0.3rem;
    padding: 3px 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-size: 1rem;
    transition: all 0.2s;
}

button:active {
    transition: all 0.2s;
}

.open-btn {
    background-color: #016fb9;
    border: 1px solid #016fb9;
    color: #f1f1f1;
    width: 5vw;
    height: 5vh;
}

.open-btn:hover {
    transition: all 0.2s;
    background-color: #00548b;
    border: 1px solid #00548b;
    color: #fff;
}

.close-btn {
    background-color: #f44336;
    border: 1px solid #f44336;
    color: #f1f1f1;
    width: 5vw;
    height: 5vh;
}

.close-btn:hover {
    transition: all 0.2s;
    background-color: #a02c23;
    border: 1px solid #a02c23;
    color: #fff;
}

.edit-btn {
    background-color: #353531;
    border: 1px solid #353531;
    color: #f1f1f1;
    width: 5vw;
    height: 5vh;
}

.edit-btn:hover {
    transition: all 0.2s;
    background-color: #000;
    border: 1px solid #000;
}

@media (max-width: 600px) {
    .open-btn {
        background-color: #016fb9;
        border: 1px solid #016fb9;
        color: #f1f1f1;
        width: 20vw;
        height: 4vh;
    }

    .open-btn:hover {
        transition: all 0.2s;
        background-color: #00548b;
        border: 1px solid #00548b;
        color: #fff;
    }

    .close-btn {
        background-color: #f44336;
        border: 1px solid #f44336;
        color: #f1f1f1;
        width: 20vw;
        height: 4vh;
    }

    .close-btn:hover {
        transition: all 0.2s;
        background-color: #a02c23;
        border: 1px solid #a02c23;
        color: #fff;
    }

    .edit-btn {
        background-color: #353531;
        border: 1px solid #353531;
        color: #f1f1f1;
        width: 20vw;
        height: 4vh;
    }

    .edit-btn:hover {
        transition: all 0.2s;
        background-color: #000;
        border: 1px solid #000;
        color: #fff;
    }
}
</style>
