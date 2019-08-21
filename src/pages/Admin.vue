<template>
  <main-layout>
    <Header></Header>
    <Footer></Footer>
  </main-layout>
</template>

<script>
  import Header from '../components/Header'
  import About from '../components/About'
  import Game from '../components/Game'
  import Footer from '../components/Footer'
  import '../assets/main_styles.css'

  import { db } from '../firebase/firebaseConfig'

  export default {
    components: {
      Header : Header,
      About : About,
      Game : Game,
      Footer : Footer
    },    

    data: function () {
        return {
            games: []
        }
    },
    firestore() {
      return {
        games: db.collection('games'),
      }
    }
  }
</script>