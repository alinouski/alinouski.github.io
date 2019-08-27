<template>
<div>
    <div class="content" id="content">
        <router-link :to="{ name: 'admin.game.add' }"><h2>New Game</h2></router-link>
    </div>  
    <div  class="content" id="content">        
        <GameElement v-for="gameData in games" v-bind:key="gameData.name" v-bind:game="gameData"></GameElement>
    </div>
</div>
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
            games: []
        }
    },
    firestore() {
      return {
        games: db.collection('games')        
      }
    }
}
</script>