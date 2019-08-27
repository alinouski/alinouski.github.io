import Terms from '../pages/TermsOfUse.vue'
import PrivacyPolicy from '../pages/PrivacyPolicy.vue'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Logout from '../pages/Logout.vue'
import SignUp from '../pages/SignUp.vue'
import Admin from '../pages/admin/Admin.vue'
import AdminMain from '../components/admin/AdminMain.vue'
import AdminGames from '../components/admin/Gameslist.vue'
import AdminEditGame from '../components/admin/EditGame.vue'

export default [
    { path: '/', component: Home },
    { path: '*', component: Home },
    { path: '/login', component: Login},
    { path: '/logout', component: Logout},
    { path: '/signup', component: SignUp},
    { 
        path: '/admin', component: Admin, meta: { requiresAuth: true },
        children: [
            {
                path: '',
                component: AdminMain,
                meta: { requiresAuth: true }
            },
            {
              path: 'games',
              name: 'admin.games',
              component: AdminGames,
              meta: { requiresAuth: true }
            },
            {
              path: 'game',
              name: 'admin.game.add',
              component: AdminEditGame,
              meta: { requiresAuth: true }
            },
            {
              path: '/game/:id',
              name: 'admin.game.edit',
              component: AdminEditGame ,
              props: true,
              meta: { requiresAuth: true }
            }
          ]
    
    },
    { path: '/privacypolicy.html', component: PrivacyPolicy },
    { path: '/termsofuse.html', component: Terms }
];