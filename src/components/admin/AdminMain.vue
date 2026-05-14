<template>
  <section class="admin-page" id="content">
    <div class="admin-page__header">
      <div>
        <p class="eyebrow">Control panel</p>
        <h1>Overview</h1>
      </div>

      <div class="admin-actions">
        <router-link class="admin-button" :to="{ name: 'admin.game.add' }">New Game</router-link>
        <router-link class="admin-button admin-button--secondary" :to="{ name: 'admin.stats' }">Stats</router-link>
      </div>
    </div>

    <div class="admin-metrics">
      <div class="metric">
        <span class="metric__label">Games</span>
        <strong>{{ gamesCount }}</strong>
      </div>
      <div class="metric">
        <span class="metric__label">Games with stats</span>
        <strong>{{ gamesWithStats }}</strong>
      </div>
    </div>
  </section>
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
