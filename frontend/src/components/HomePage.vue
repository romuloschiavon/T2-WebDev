<template>
    <h1>Home Page</h1>
</template>

<script>
export default {
    name: 'HomePage',
    mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem('token')) {
            this.$router.push('/login');
        }
    }
}
</script>