import Vue from 'vue';
import VueFirestore from 'vue-firestore';
import App from './App.vue';
import router from './router/index'
//import store from './store'
//import { db } from './firebase/firebaseConfig'

Vue.use(VueFirestore);

/*const auth =  db.app.auth();

auth.onAuthStateChanged(user => {
  store.commit('updateUser',{ user })
})*/

new Vue({
  el: '#app',
  router,
  //store,
  template: '<App/>',
  components: { App }
})


