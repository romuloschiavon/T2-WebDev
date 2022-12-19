<template>
    <div class="nav">
        <router-link to="/home">Home</router-link>
        <template v-if="userIsAdmin">
            <a id="addLock" v-on:click="addLock" href="#">Add new lock</a>
        </template>
        <a id="logout" v-on:click="logout" href="#">Logout</a>
    </div>
</template>

<script>
export default {
    name: 'TopHeader',
    methods: {
        logout() {
            // Remove the token from the local storage
            localStorage.clear();
            // Redirect to the login page
            this.$router.push('/login');
        },
        addLock() {
            // Redirect to the add lock page
            this.$router.push('/addlock');
        }
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
    mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem('token')) {
            this.$router.push('/login');
        }
    }
}
</script>

<style>
.nav {
    display: flex;
    justify-content: space-between;
    background-color: #333;
    overflow: hidden;
    width: 100%;
}

.nav a {
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
    margin-right: 5px;
}

.nav a:hover {
    background-color: #ddd;
    color: #333;
}
</style>