<template>
    <div class="container">
        <div class="aplication-container" id="app1" >
            <div class="application-line" id="app-name">       
                    
                <router-link  :to="{ name: 'admin.game.edit', params: {id: game['.key']}}"><h1>{{game.name}}<input type="checkbox" v-model="game.hosted"></h1>  </router-link>
            </div>
        </div>
    </div>	
</template>

<script>
export default {
    props: {
        'game': Object
        }
}
</script>