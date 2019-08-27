<template>
<div>
        <div class="header" id="head">
            <div class="nav-menu">		
                <div class="menu-item">
                    <router-link :to="{ name: 'admin.games' }">Games</router-link>
                </div>              
                <div class="menu-item">
                    <router-link to="/admin" value="#top" class="nav">Admin</router-link>
                </div>	
                <div class="menu-item">
                    <router-link to="/logout" value="#content" class="nav">Logout</router-link>
                </div>	
                
                <div class="logo">
                    <router-link to="/home" value="#top" class="nav">Home</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>