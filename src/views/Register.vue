<template>
  <div>
    <h2>登録</h2>
    <label for="name">eメール：</label>
    <input
      id="name"
      type="email"
      v-model="email"
    >
    <br><br>
    <label for="name">パスワード：</label>
    <input
      id="name"
      type="password"
      v-model="password"
    >
    <br><br>
    <button @click="register">送信</button>
  </div>
</template>

<script>
import axios from '../axios-auth';
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
      register() {
          axios.post('/accounts:signUp?key=AIzaSyDLSK9NIKJLvpSGlkUW6pvTs6WN9efzSHM',
          {
              email: this.email,
              password: this.password,
              returnSecureToken: true
          }).then(response => {
              console.log(response);
          }).catch(error => {
              console.log(error.response.data.error);
          });
      }
  }
};
</script>

