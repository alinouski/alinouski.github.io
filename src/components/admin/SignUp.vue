<template>
  <div class="content">
    <h3>Create a new account</h3>
    <input
      v-model="email" 
      type="text" 
      class="input" 
      placeholder="Email" 
      required>
    <br>
    <input 
      v-model="password"
      type="password" 
      class="input" 
      placeholder="Password" 
      required>
    <br>
    <button v-on:click="signUp" class="button">Sign Up!</button>
    <button class="button">
      <router-link to="/login">
        Back
      </router-link>
    </button>
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

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .login {
    margin-top: 40px;
  }
  input {
    margin: 10px 0;
    width: 20%;
    padding: 15px;
  }
  button {
    margin-top: 20px;
    width: 10%;
    cursor: pointer;
  }
  p {
    margin-top: 40px;
    font-size: 13px;
  }
  p a {
    text-decoration: underline;
    cursor: pointer;
  }
</style>