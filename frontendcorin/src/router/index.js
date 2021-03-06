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
import TheMainInstrument from '@/views/TheMainInstrument'
import ClientManager from '@/views/ClientManager.vue'
import ConfigSurveyManager from '@/views/ConfigSurveyManager.vue'
import CustomizeSurvey from '@/views/CustomizeSurvey.vue'


// Views - Pages
import Page404 from '@/views/Errors/Page404'
import Page500 from '@/views/Errors/Page500'

Vue.use(Router)

const Results = () =>
    import ('@/views/Results.vue')


export default new Router({
    mode: 'hash',
    linkActiveClass: 'open active',
    scrollBehavior: () => ({ y: 0 }),
    routes: [{
            path: '/',
            redirect: '/login-code',
            name: 'Pages',
            component: {
                render(c) { return c('router-view') }
            },
            children: [{
                    path: '404',
                    name: 'Page404',
                    component: Page404
                },
                {
                    path: '500',
                    name: 'Page500',
                    component: Page500
                },
                {
                    path: 'login-code',
                    name: 'LoginAccessCode',
                    component: () =>
                        import ('@/views/Login/LoginAccessCode.vue')
                },
                {
                    path: 'login-pwd',
                    name: 'LoginByPassword',
                    component: () =>
                        import ('@/views/Login/LoginUserPassword.vue')
                }
            ]
        },
        {
            path: '/main',
            redirect: '/main_instrument',
            name: 'Home',
            component: Full,
            /* así se especifica que el resto de componentes son hijos de full */
            /* El campo "name" es el alias que se le da a la rutan no el nombre que aparece en el menu" */
            children: [{
                    path: '/main_instrument',
                    name: 'Encuesta',
                    component: TheMainInstrument
                },
                {
                    path: '/result-by-categories',
                    name: 'ResultadosCategorias',
                    component: Results
                },
                {
                    path: '/result-by-areas',
                    name: 'Resultados por áreas',
                    component: Results
                },
                {
                    path: '/results_by_dim_comp',
                    name: 'Resultados por dimensiones y componentes',
                    component: Results
                },
                {
                    path: '/results_by_dim_comp_table',
                    name: 'Tabla resumen',
                    component: Results
                },
                {
                    path: '/result-by-directives',
                    name: 'Resultados para directivos y no directivos',
                    component: Results
                },
                {
                    path: '/export',
                    name: 'Exportar resultados',
                    component: () =>
                        import ('@/views/ExportResults.vue')

                },
                {
                    path: '/clients',
                    name: 'Clientes',
                    component: ClientManager
                },
                {
                    path: '/configSurveys',
                    name: 'Configurar encuestas',
                    component: ConfigSurveyManager

                },
                {
                    path: '/customSurvey',
                    name: 'Personalizar encuesta',
                    component: CustomizeSurvey

                },
                {
                    path: '/users',
                    name: 'Usuarios',
                    component: () =>
                        import ('@/views/UsersManager.vue')

                }
            ]
        },

    ]
})