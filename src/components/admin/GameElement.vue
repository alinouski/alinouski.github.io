<template>
    <div class="container">
        <div class="aplication-container" id="app1" >
            <div class="application-line" id="app-name">
                <h1>{{game.name}}</h1>
            </div>

            <div class="application-line" id="app-content" style="clear: both;">
                <div class="application-column">
                    <div class="app-icon">
                        <img v-bind:src="game.icon" style="width:80%; border-radius: 20%;">	
                    </div>  
                    <div class="market-link">
                        <div id="app-name">
                        <router-link  :to="{ name: 'admin.game.edit', params: {id: game['.key']}}"><h2>Edit</h2></router-link>
                        </div>
                    </div>


                </div>
                <div class="application-column" >
                    <div id="app-name">
                        <h2>Description</h2>
                    </div>
                    {{game.description}}
                </div>		
                <div class="application-column">
                    <img data-enlargable v-bind:src="game.screen1" alt="Monterosso" style="width:100%;cursor: zoom-in" class="img-enlargable">			
                </div>
                <div class="application-column">
                    <img data-enlargable v-bind:src="game.screen2" alt="Monterosso" style="width:100%;cursor: zoom-in" class="img-enlargable">
                </div>                                
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