<template>
 <div class = 'app-containor'>

    <div ref="loginForm" >
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="error-message" v-if="loginError">{{ loginError }}</div>
        <button type="submit">Login</button>
      </form>
    </div>
    <p v-if="isLoggedIn">Welcome, {{ username }}!</p>
  
 </div>
</template>


<script>
import axios from 'axios';
export default{
  data(){
    return{
      username: '',
      password: '',
      isLoggedIn:false,
      loginError : ''
    };
  },
  methods:{
    async handleLogin() {
      this.loginError = '';
      try {
        const response = await axios.post('http://localhost:4000/api/user/login', {
          userName: this.username,
          password: this.password,
        });
        const token = response.data.token;
        localStorage.setItem('token', token); // Store token in localStorage
        this.isLoggedIn = true; // Set logged in state
        console.log(this.username)
        this.username = ''; // Clear username after login
        this.password = ''; // Clear password after login
      } catch (error) {
        this.loginError = error.response.data.message || 'Login failed';
      }
    },
  }
}

</script>
