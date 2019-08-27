import firebase from 'firebase';
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes.js';
import store from '../store'

Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes,
    mode : 'history'
  });
  

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  let isLoginOrSignIn = to.matched.some(record => (record.path == 'login' || record.path == 'signin'))
  
  if (requiresAuth && !currentUser) next('login')
  else if (isLoginOrSignIn && currentUser) next('admin')
  else next()
})
export default router;