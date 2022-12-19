<template>
    <div class="nav">
        <div class="home">
            <router-link id="home" to="/home" scroll-behavior="smooth">
                <span id="#home-icon" class="material-icons">home</span>
                <a> Home</a>
            </router-link>
        </div>
        <div class="addNewLock">
            <template v-if="userIsAdmin">
                <span id="#addLock-icon" class="material-icons">add</span>
                <span id="#addLock-icon" class="material-icons">lock</span>
                <a id="addLock" v-on:click="addLock" href="#"> Add new lock</a>
            </template>
        </div>
        <div class="logout">
            <span id="#logout-icon" class="material-icons">logout</span>
            <a id="logout" v-on:click="logout" href="#"> Logout</a>
        </div>
    </div>
</template>

<script>
export default {
    name: "TopHeader",
    methods: {
        logout() {
            // Remove the token from the local storage
            localStorage.clear();
            // Redirect to the login page
            this.$router.push("/login");
        },
        addLock() {
            // Redirect to the add lock page
            this.$router.push("/addlock");
        },
    },
    created() {
        // Check if the user is an admin
        if (localStorage.getItem("admin") === "true") {
            this.userIsAdmin = true;
        } else {
            this.userIsAdmin = false;
        }
    },
    mounted() {
        // If the user is not logged in, redirect to the login page
        if (!localStorage.getItem("token")) {
            this.$router.push("/login");
        }
    },
};
</script>

<style>
a {
    font-family: Poppins;
}

.nav {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    background-color: #353531;
    overflow: hidden;
    width: 100vw;
    height: 8vh;
}

.home a,
.addNewLock a,
.logout a,
.home span,
.addNewLock span,
.logout span {
    font-size: 1.2rem;
    color: #ff9505;
    text-decoration: none;
}

.home:hover a,
.addNewLock:hover a,
.logout:hover a,
.home:hover span,
.addNewLock:hover span,
.logout:hover span {
    color: #ec4e20;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.2s;
}

.logout {
    margin-right: 2vw;
}

.home {
    margin-left: 1vw;
}

@media (max-width: 600px) {
    .home {
        margin-left: 3vw;
    }

    .logout {
        margin-right: 3vw;
    }

    .home a,
    .addNewLock a,
    .logout a,
    .home span,
    .addNewLock span,
    .logout span {
        font-size: 1rem;
        color: #ff9505;
        text-decoration: none;
    }

    .home:hover a,
    .addNewLock:hover a,
    .logout:hover a,
    .home:hover span,
    .addNewLock:hover span,
    .logout:hover span {
        color: #ec4e20;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.2s;
    }
}
</style>
