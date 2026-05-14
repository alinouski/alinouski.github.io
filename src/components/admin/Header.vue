<template>
  <header class="site-header admin-header" id="head">
    <router-link to="/admin" class="site-header__brand">Admin</router-link>

    <nav class="site-header__nav" aria-label="Admin navigation">
      <router-link to="/home" class="nav">Site</router-link>
      <router-link to="/admin" class="nav">Overview</router-link>
      <router-link :to="{ name: 'admin.games' }" class="nav">Games</router-link>
      <router-link :to="{ name: 'admin.stats' }" class="nav">Stats</router-link>
      <router-link :to="{ name: 'admin.settings' }" class="nav">Settings</router-link>
      <router-link to="/logout" class="nav">Logout</router-link>
    </nav>
  </header>
</template>

<script>
export default {
    
}
</script>
