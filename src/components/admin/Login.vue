<template>
  <div class="auth-panel">
    <p class="eyebrow">Admin access</p>
    <h1>Login</h1>

    <label class="field">
      <span>Email</span>
      <input type="text" v-model="email" placeholder="Email">
    </label>

    <label class="field">
      <span>Password</span>
      <input type="password" v-model="password" placeholder="Password">
    </label>

    <button class="admin-button" @click="login">Connect</button>
    <!--p>You don't have an account ? You can <router-link to="/signup">create one</router-link></p-->
  </div>
</template>

<script>
  import firebase from 'firebase';
  export default {
    name: 'login',
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      login: function() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$router.replace('admin')
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        );
      }
    }
  }
</script>
