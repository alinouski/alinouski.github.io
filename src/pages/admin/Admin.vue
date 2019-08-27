<template>
  <admin-layout>
    <div>
    <router-view></router-view>
    </div>
  </admin-layout>
</template>

<script>
  import AdminLayout from '../../layouts/AdminLayout'
  export default {
    components: {
      AdminLayout : AdminLayout
    }
  }
</script>