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
import MainInstrument from '@/views/at-views/MainInstrument'
import Results from '@/views/at-views/Results.vue'
import ClientManager from '@/views/at-views/ClientManager.vue'
import ConfigSurveyManager from '@/views/at-views/ConfigSurveyManager.vue'
import CustomizeSurvey from '@/views/at-views/CustomizeSurvey.vue'

Vue.use(Router)

const ResultsByCategories = () =>
    import ('@/views/at-views/ResultsByCategories.vue')

const ExportResults = () =>
    import ('@/views/at-views/ExportResults.vue')

export default new Router({
    mode: 'hash',
    linkActiveClass: 'open active',
    scrollBehavior: () => ({ y: 0 }),
    routes: [{
        path: '/',
        redirect: '/main_instrument',
        name: 'Home',
        component: Full,
        /* así se especifica que el resto de componentes son hijos de full */
        children: [{
                path: 'main_instrument',
                name: 'Encuesta',
                component: MainInstrument
            },
            {
                path: 'result',
                name: 'Resultados',
                component: ResultsByCategories
            },
            {
                path: '/result-by-categories',
                name: 'Resultados por categorías',
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
                path: '/result-by-directives',
                name: 'Resultados para directivos y no directivos',
                component: Results
            },
            {
                path: '/export',
                name: 'Exportar resultados',
                component: ExportResults
            },
            {
                path: 'clients',
                name: 'Clientes',
                component: ClientManager
            },
            {
                path: 'configSurveys',
                name: 'Configurar encuestas',
                component: ConfigSurveyManager

            },
            {
                path: 'customSurvey',
                name: 'Personalizar encuesta',
                component: CustomizeSurvey

            }

        ]
    }]
})