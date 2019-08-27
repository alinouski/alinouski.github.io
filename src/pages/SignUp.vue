<template>
  <main-layout>
    <SignUp/>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/MainLayout'
  import SignUp from '../components/admin/SignUp'

  import { db } from '../firebase/firebaseConfig'

  export default {
    components: {
      MainLayout : MainLayout,
      SignUp : SignUp
    }
  }
</script>