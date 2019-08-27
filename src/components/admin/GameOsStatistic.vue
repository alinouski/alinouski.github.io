<template>
    <div>          
        <div class="application-line" id="app-name">
            <h1>{{game_os.name}}</h1>
        </div>
        <div v-for="version in game_os.versions" v-bind:key="version.name">
            <h1>{{version.name}}</h1><br>
            <LevelsChart v-bind:levels="version.levels"/>
        </div>  
    </div>
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