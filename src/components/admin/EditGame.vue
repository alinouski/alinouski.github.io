<template>
    <div>
        <div class="content" id="content">
            
            <div class="container">                
                <FileUploader v-on:url="updateIcon">
                    Icon <input type="text" v-model="game.icon" placeholder="icon">
                </FileUploader><br>
                App name <input type="text" v-model="game.name" placeholder="name"><br>
                Description <input type="text" v-model="game.description" placeholder="description"><br>
                Google play<input type="text" v-model="game.gpUrl" placeholder="PlayMarket"><br>
                App Store<input type="text" v-model="game.appStoreUrl" placeholder="AppStore"><br>            
                Video link<input type="text" v-model="game.video" placeholder="video"><br>
                <FileUploader v-on:url="updateFeatcher">
                    Featcher <input type="text" v-model="game.featcher" placeholder="featcher">
                </FileUploader><br>
                <FileUploader v-on:url="updateScreen1">
                    Screenshoot 1 <input type="text" v-model="game.screen1" placeholder="screen1">
                </FileUploader><br>
                <FileUploader v-on:url="updateScreen2">
                    Screenshoot 2 <input type="text" v-model="game.screen2" placeholder="screen2">
                </FileUploader><br>
                <FileUploader v-on:url="updateScreen3">
                    Screenshoot 3 <input type="text" v-model="game.screen3" placeholder="screen3">
                </FileUploader><br>
                Is available<input type="checkbox" v-model="game.hosted"> <br>
                <button @click="save">Save</button>
                <button @click="del">Delete</button>
            </div>	
            
        </div>
            <Game v-bind:game="game"/>
    </div>
</template>

<script>
import { db } from '../../firebase/firebaseConfig'
import Game from '../Game'
import FileUploader from '../utils/FileUploader'

export default {
    components:{
        Game: Game,
        FileUploader: FileUploader
    },
    data: function () {
        return {
            game: {
                icon: '',
                name: 'empty',
                description: 'empty'
            }
        }
    },
    props: {
        'id': String
    },
    firestore(){
      return {
        game: db.collection('games').doc(this.id)
      }
    },
    methods: {
        save: function(){
            console.log(this.id);
            if(typeof this.id === 'undefined'){
                db.collection('games').add(this.game).then(ref => {
                    console.log('Added document with ID: ', ref.id);
                    this.id = ref.id;
                }).then(function(){
                    alert(this.game.name+" Game added");
                });
            }else{
                db.collection('games').doc(this.id).set(this.game);
            }
        },
        del: function(){
            if(confirm("Do you really want to delete?")){
                db.collection('games').doc(this.id).delete();
                this.$router.go('admin/games');
            }
        },
        updateIcon: function(value){
            this.$forceUpdate();
            this.$set(this.game, 'icon', value);
        },
        updateFeatcher: function(value){
            this.$forceUpdate();
            this.$set(this.game, 'featcher', value);
        },
        updateScreen1: function(value){
            this.$forceUpdate();
            this.$set(this.game, 'screen1', value);
        },
        updateScreen2: function(value){
            this.$forceUpdate();
            this.$set(this.game, 'screen2', value);
        },
        updateScreen3: function(value){
            this.$forceUpdate();
            this.$set(this.game, 'screen3', value);
        }
    }
}
</script>