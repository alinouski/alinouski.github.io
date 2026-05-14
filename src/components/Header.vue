<template>
  <div>
    <header
      class="site-header site-header--minimal"
      v-bind:class="{ 'site-header--hidden': isHeaderHidden }"
      id="head"
    >
      <nav class="site-header__nav" aria-label="Primary navigation">
        <router-link to="/login" class="nav">Login</router-link>
      </nav>
    </header>

    <button
      v-if="showTopButton"
      class="scroll-top-button"
      type="button"
      aria-label="Scroll to top"
      v-on:click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<script>
  export default {
    data: function () {
        return{
            isHeaderHidden: false,
            showTopButton: false
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll, { passive: true })
        this.handleScroll()
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        handleScroll: function(){
            const scrollY = window.pageYOffset || document.documentElement.scrollTop
            const shouldHide = scrollY > 80

            this.isHeaderHidden = shouldHide
            this.showTopButton = shouldHide
        },
        scrollToTop: function(){
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }
  }
</script>
