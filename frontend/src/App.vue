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
body{
  padding: 0;
  margin: 0;
}
.app-container {
  width: 100vw;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
