import Terms from '../pages/TermsOfUse.vue'
import PrivacyPolicy from '../pages/PrivacyPolicy.vue'
import Home from '../pages/Home.vue'
import Admin from '../pages/Admin.vue'

export default [
    { path: '/', component: Home },
    { path: '*', component: Home },
    { path: '/admin', component: Admin },
    { path: '/privacypolicy.html', component: PrivacyPolicy },
    { path: '/termsofuse.html', component: Terms }
];