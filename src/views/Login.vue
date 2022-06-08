<template>
  <div>
    <h2>ログイン</h2>
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
    <button @click="login">送信</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
      login() {
          
      }
  }
};
</script>

