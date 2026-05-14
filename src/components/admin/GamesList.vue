<template>
  <section class="admin-page" id="content">
    <div class="admin-page__header">
      <div>
        <p class="eyebrow">Content</p>
        <h1>Games</h1>
      </div>

      <router-link class="admin-button" :to="{ name: 'admin.game.add' }">New Game</router-link>
    </div>

    <div class="admin-list">
      <GameElement
        v-for="(gameData, index) in sortedGames"
        :key="gameData['.key'] || gameData.name"
        :game="gameData"
        :is-dragging="dragIndex === index"
        :is-drag-over="dragOverIndex === index && dragIndex !== null && dragIndex !== index"
        @drag-start="startDrag(index, $event)"
        @drag-over="dragOver(index)"
        @drop-game="dropGame(index)"
        @drag-end="resetDrag"
      ></GameElement>
    </div>
  </section>
</template>

<script>
import { db } from '../../firebase/firebaseConfig'

import GameElement from '../../components/admin/GameElement'

export default {
    components: {
        GameElement: GameElement
    },    
    data: function () {
        return {
            games: [],
            dragIndex: null,
            dragOverIndex: null
        }
    },
    computed: {
        sortedGames: function () {
            return this.games.slice().sort((first, second) => this.gameOrder(first) - this.gameOrder(second))
        }
    },
    firestore() {
      return {
        games: db.collection('games')        
      }
    },
    methods: {
        gameOrder: function(game) {
            return Number.isFinite(Number(game.order)) ? Number(game.order) : this.games.indexOf(game)
        },
        startDrag: function(index, event) {
            this.dragIndex = index
            this.dragOverIndex = index

            if (event && event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move'
                event.dataTransfer.setData('text/plain', String(index))
            }
        },
        dragOver: function(index) {
            if (this.dragIndex === null) {
                return
            }

            this.dragOverIndex = index
        },
        dropGame: function(index) {
            if (this.dragIndex === null || this.dragIndex === index) {
                this.resetDrag()
                return
            }

            const orderedGames = this.sortedGames.slice()
            const movedGame = orderedGames.splice(this.dragIndex, 1)[0]
            orderedGames.splice(index, 0, movedGame)
            this.saveOrder(orderedGames)
            this.resetDrag()
        },
        resetDrag: function() {
            this.dragIndex = null
            this.dragOverIndex = null
        },
        saveOrder: function(orderedGames) {
            const batch = db.batch()
            orderedGames.forEach((game, index) => {
                if (game['.key']) {
                    this.$set(game, 'order', index + 1)
                    batch.set(db.collection('games').doc(game['.key']), { order: index + 1 }, { merge: true })
                }
            })
            batch.commit()
        }
    }
}
</script>
