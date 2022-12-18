<template>
    <TopHeader/>
    <h1>Edit Selected Lock Page</h1>
    <div class="editLock-form">
        <form @submit.prevent="addLock">
            <input id="name" v-model="name" type="text" required placeholder="Name">
            <input id="password" v-model="password" type="password" required placeholder="Password">
            <input id="passwordCorfim" v-model="passwordCorfim" type="password" required placeholder="Confirm Password">
        </form>
    </div>
</template>

<script>
import TopHeader from './Header.vue'
// import axios from 'axios'
// import api_url from '../config'

export default {
    name: 'EditLock',
    components: {
        TopHeader
    },
    data() {
        return {
            lockName: '',
            password: '',
            userName: []
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

        // let usersInfo = await axios({
        //     method: 'get',
        //     url: api_url + '/locks/' + this.$route.params.id + '/users',
        //     headers: { 'Authorization': localStorage.getItem('token') }
        // });


    }
}
</script>