<template>
  <main-layout>
    <About></About>
    <Game v-for="gameData in sortedGames" v-bind:key="gameData.name" v-bind:game="gameData"></Game>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/MainLayout'
  import About from '../components/About'
  import Game from '../components/Game'

  import { db } from '../firebase/firebaseConfig'

  export default {
    components: {
      MainLayout : MainLayout,
      About : About,
      Game : Game
    },    

    data: function () {
        return {
            games: []
        }
    },
    computed: {
      sortedGames: function () {
        return this.games.slice().sort((first, second) => this.gameOrder(first) - this.gameOrder(second))
      }
    },
    firestore() {
      return {
        games: db.collection('games').where('hosted','==', true),
      }
    },
    methods: {
      gameOrder: function (game) {
        return Number.isFinite(Number(game.order)) ? Number(game.order) : this.games.indexOf(game)
      }
    }
  }
</script>
