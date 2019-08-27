<template>
  <main-layout>
    <Login/>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/MainLayout'
  import Login from '../components/admin/Login'

  import { db } from '../firebase/firebaseConfig'

  export default {
    components: {
      MainLayout : MainLayout,
      Login : Login
    }
  }
</script>