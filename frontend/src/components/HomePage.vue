<template>
    <TopHeader/>
    <h1>Home Page</h1>
    <table>
        <tr>
            <th>Lock Name</th>
            <th>Lock Status</th>
        </tr>
        <tr v-for="lock in locks" :key = "lock.id">
            <td>{{lock.name}}</td>
            <td>{{lock.isLocked}}</td>
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
    async mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem('token')) {
            this.$router.push('/login');
        }
        // Get the list of locks
        let result = await axios.get(api_url + '/usersLocks/updateLock');
        console.warn(result);
    }
}
</script>