<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png">
    <dashboard />
    <Login />
  </div>
</template>


<script>
import Login from '../src/views/Login.vue'
import dashboard from './views/landing.vue'

export default {
  name: 'App',
  components: {
    dashboard,
    Login
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
