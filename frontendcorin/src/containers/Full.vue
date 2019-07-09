<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <base-loading :isLoading="isLoading"></base-loading>
          <errors-list></errors-list>
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '@/components/BaseComponents'
import ErrorsList from '@/components/BusinessLogic/ErrorsList'
import { mapGetters } from 'vuex'
import { ADMIN, COMPANY, CLIENT, PARTICIPANT } from '@/store/profiles.type'
export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb,
    ErrorsList,
    baseLoading: () => import('@/components/BaseComponents/BaseLoading')
  },
  data () {
    return {
      nav: this.getMenuItems()
    }
  },
  methods: {
    getMenuItems: function () {
      /* Se ajusta para que se muestren los items del menu segun el perfil */
      var paths = []
      var profile = this.$store.getters.profile
      if (profile === PARTICIPANT || profile === ADMIN) { // Participant
        paths = paths.concat([{
          name: 'Evaluación',
          url: '/main_instrument',
          icon: 'fa icon-notebook'
        }])
      }
      if (profile === CLIENT || profile === ADMIN) {
        paths = paths.concat([
          {
            title: true,
            name: 'Resultados',
            url: '/result',
            icon: 'fa fa-pie-chart'
          },
          {
            name: 'Por categorías',
            url: '/result-by-categories',
            icon: 'fa icon-graph'
            // TODO completar
          },
          {
            name: 'Por directivos/no directivos',
            url: '/result-by-directives',
            icon: 'fa icon-graph'
            // TODO completar
          },
          {
            name: 'Por áreas',
            url: '/result-by-areas',
            icon: 'fa icon-graph'

          },
          {
            title: true,
            name: 'Resultados específicos',
            url: '/especific_results',
            icon: 'fa icon-puzzle'

          },
          {
            name: 'Por dimensiones y componentes',
            url: '/results_by_dim_comp',
            icon: 'fa icon-chart'

          },
          {
            name: 'Exportar',
            url: '/export',
            icon: 'fa icon-cloud-download'
          }])
      }
      if (profile === COMPANY || profile === ADMIN) {
        paths = paths.concat([{
          title: true,
          name: 'Configuración'
        },
        {
          name: 'Clientes',
          url: '/clients',
          icon: 'fa icon-people'
        },
        {
          name: 'Personalizar encuesta',
          url: '/customSurvey',
          icon: 'fa icon-settings'
        },
        {
          name: 'Configuración de encuestas',
          url: '/configSurveys',
          icon: 'fa icon-docs'
        }
        ])
      }
      return paths
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    },
    ...mapGetters(['isLoading', 'profile']) // Trae los getters
  }
}
</script>
