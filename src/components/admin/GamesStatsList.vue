<template>
  <section class="admin-page" id="content">
    <div class="admin-page__header">
      <div>
        <p class="eyebrow">Analytics</p>
        <h1>Stats</h1>
      </div>

      <router-link class="admin-button admin-button--secondary" to="/admin">Back</router-link>
    </div>

    <div class="admin-list">
      <router-link
        v-for="gameData in games_stats"
        :key="gameData['.key']"
        class="admin-list-item admin-list-item--link"
        :to="{ name: 'admin.stats.game', params: { id: gameData['.key'] }}"
      >
        <span class="admin-list-item__title">{{ gameData['.key'] }}</span>
        <span class="admin-list-item__meta">Open report</span>
      </router-link>
    </div>
  </section>
</template>

<script>
import { db } from '../../firebase/firebaseConfig'

export default {
    components: {},    
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
