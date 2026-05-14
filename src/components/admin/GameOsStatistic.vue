<template>
  <section class="stats-panel">
    <h2>{{ game_os.name }}</h2>

    <div class="stats-version" v-for="version in game_os.versions" :key="version.name">
      <div class="stats-version__header">
        <span>Version</span>
        <strong>{{ version.name }}</strong>
      </div>
      <LevelsChart :levels="version.levels"/>
    </div>
  </section>
</template>

<script>
import LevelsChart from '../../components/admin/LevelsStatisticChart'

export default {
    components:{
        LevelsChart
    },
    props: {
        'game_os': Object
    }
}
</script>
