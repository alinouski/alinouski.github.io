<template>
<div class="content" id="content">
    <router-link :to="{ name: 'admin.game.add' }"><h2>New Game</h2></router-link>
    <router-link :to="{ name: 'admin.stats' }"><h2>Stats</h2></router-link>
    AdminPanel<br>
    Total games on db {{gamesCount}}<br>
    Total games with statistic on db {{gamesWithStats}}<br>
</div>
</template>

<script>
import { db } from '../../firebase/firebaseConfig'

export default {
    components: {
    },    
    data: function () {
        return {
            gamesCount: 0,
            gamesWithStats: 0
        }
    },
    firestore() {
        db.collection('games_stats').get().then(snap => {
            console.log(snap);
            this.gamesWithStats = snap.size
        })

        //console.log(db.collection('games_stats').get().docs);

        db.collection('games').get().then(snap => {            
            this.gamesCount = snap.size
        })      
    }
}
</script>