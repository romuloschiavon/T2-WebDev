<template>
  <div class="app-container">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background-color: #ff9505;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #EC4E20;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.img-container {
  width: 300px;
  margin: 0 auto;
}
.img-logo-ufsc {
  width: 100%;
  height: auto;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Ubuntu', sans-serif;
}

body{
  font-family: 'Poppins', sans-serif;
  padding: 0;
  margin: 0;
  overflow-x: hidden
}

.app-container {
  width: 100vw;
  min-width: 100vw;
  display: block;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
}

.material-icons {
  vertical-align: middle;
}

button:hover {
  transform: scale(1.1);
  transition: all 0.2s;
}
</style>
