<template>
    <TopHeader/>
    <h1>Edit Selected Lock Page</h1>
</template>

<script>
import TopHeader from './Header.vue'

export default {
    name: 'EditLock',
    components: {
        TopHeader
    },
    mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem('token')) {
            this.$router.push('/login');
        }
    }
}
</script>