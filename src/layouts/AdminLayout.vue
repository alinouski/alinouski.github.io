<template>
    <div>
        <Header></Header>
        <slot></slot>
        <Footer></Footer>
    </div>
</template>

<script>
  import Header from '../components/admin/Header'
  import Footer from '../components/Footer'
  import '../assets/main_styles.css'

  export default {
    name:'admin-layout',
    components: {
      Header : Header,
      Footer : Footer
    }
  }
</script>