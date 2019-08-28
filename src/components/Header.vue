<template>
    <div>
        <div class="header" id="head">
            <div class="nav-menu">		
                <div v-if="!isLogin" class="menu-item">
                    <router-link to="/games" value="#content" class="nav">Games</router-link>
                </div>
                <div v-if="isLogin" class="menu-item">
                    <router-link to="/admin/games" value="#content" class="nav">Games</router-link>
                </div>
                <div class="menu-item">
                    <router-link v-bind:to="link" value="#content" class="nav">{{header}}</router-link>
                </div>
                <div v-if="isLogin" class="menu-item">
                    <router-link to="/logout" value="#content" class="nav">Logout</router-link>
                </div>
                
                <!--div class="menu-item">
                    <a href="#" value="#about" class="nav">About</a>
                </div-->		
                <div class="logo">
                    <router-link to="/home" value="#top" class="nav">Home</router-link>
                </div>		
            </div>
        </div>
    </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    data: function () {
        return{
            link: '/login',
            header: 'Login',
            isLogin: false
        }
    },
    created() {
        if(firebase.auth().currentUser){
            this.link = '/admin'
            this.header = 'Admin'
            this.isLogin = true
        }
        else
        {
            this.link = '/login'
            this.header = 'Login'
            this.isLogin = false
        }
    },
    methods: {
        logout: function(){
            firebase.auth().signOut().then(() => {
                this.$router.replace('login')
            })
        }
    }
  }
</script>