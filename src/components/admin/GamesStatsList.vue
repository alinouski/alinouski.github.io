<template>
<div>
    <div class="content" id="content">
        <router-link to='/admin'><h2>Back</h2></router-link>
    </div>  
    <div  class="content" id="content">        
        <div v-for="gameData in games_stats" v-bind:key="gameData['.key']">
            <router-link  :to="{ name: 'admin.stats.game', params: {id: gameData['.key']}}">
                <h1>{{gameData['.key']}}</h1>
            </router-link>
        </div>        
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
            games_stats: []
        }
    },
    firestore() {
      return {
        games_stats: db.collection('games_stats')        
      }
    }
}
</script>