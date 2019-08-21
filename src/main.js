import Vue from 'vue'
import VueFirestore from 'vue-firestore';
import App from './App.vue'

Vue.use(VueFirestore);

//const fb = require('./firebase/firebaseConfig')

import router from './router/index'

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

/*let app
fb.auth.onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
          el: '#app',
          router,
          template: '<App/>',
          components: { App }
        })
    }
})*/