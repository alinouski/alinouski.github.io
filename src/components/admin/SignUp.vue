<template>
  <div class="auth-panel">
    <p class="eyebrow">Admin access</p>
    <h1>Create account</h1>

    <label class="field">
      <span>Email</span>
      <input v-model="email" type="text" placeholder="Email" required>
    </label>

    <label class="field">
      <span>Password</span>
      <input v-model="password" type="password" placeholder="Password" required>
    </label>

    <div class="admin-actions">
      <button v-on:click="signUp" class="admin-button">Sign Up</button>
      <router-link class="admin-button admin-button--secondary" to="/login">Back</router-link>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  export default {
    name: 'signup',
    data () {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      signUp () {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
          this.$router.replace('/login')
        }).catch((err) => {
          alert(err.message)
        });
      }
    }
  }
</script>
