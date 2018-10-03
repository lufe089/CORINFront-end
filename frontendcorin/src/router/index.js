/* Vue routes documentation API https://router.vuejs.org
  Each route will have a name which is defined with the property "name", this name
  will appear in the BreadCrumb

  In this app The <router-view> here is a top-level outlet.
  It renders the component matched by a top level route.
  Similarly, a rendered component can also contain its own, nested <router-view>.
  But in this case is mandatory to use the children tag
  https://router.vuejs.org/guide/essentials/nested-routes.html

  nested paths that start with / will be treated as a root path
*/

/* eslint-disable */

import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'

// Views - Components
import Cards from '@/views/base/Cards'
import Forms from '@/views/base/Forms'
import MainInstrument from '@/views/at-views/MainInstrument'
import Results from '@/views/at-views/Results.vue'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    linkActiveClass: 'open active',
    scrollBehavior: () => ({ y: 0 }),
    routes: [{
        path: '/',
        redirect: '/dashboard',
        name: 'Home',
        component: Full,
        /* así se especifica que el resto de componentes son hijos de full */
        children: [{
                path: 'dashboard',
                name: 'Dashboard',
                component: Dashboard
            },
            {
                path: 'main_instrument',
                name: 'Main Instrument',
                component: MainInstrument
            },
            {
                path: 'result',
                name: 'Resultados',
                component: Results
            },
            {
                path: 'base',
                redirect: '/base/cards',
                name: 'Base',
                component: {
                    /* Empty root */
                    render(c) { return c('router-view') }
                },
                children: [{
                        path: 'forms',
                        name: 'Forms',
                        component: Forms
                    },
                    {
                        path: 'cards',
                        name: 'Cards',
                        component: Cards
                    }
                ]
            }

        ]
    }]
})