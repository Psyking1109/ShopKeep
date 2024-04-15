import Login from './views/Login.vue'
import dashboard from './views/landing.vue'
import invoice from './views/invoice.vue'

export default[
    {path:'/Dashboard',component:dashboard},
    {path:'/Login',component:Login},
    {path:'/invoice',component:invoice},
];