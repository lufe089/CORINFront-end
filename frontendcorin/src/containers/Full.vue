<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <base-loading :isLoading="isLoading"></base-loading>
          <the-errors-list></the-errors-list>
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import nav from '../_nav'
import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '@/components/BaseComponents'
import TheErrorsList from '@/components/BusinessLogic/TheErrorsList'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb,
    TheErrorsList,
    baseLoading: () => import('@/components/BaseComponents/BaseLoading')
  },
  data () {
    return {
      nav: nav.items
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    },
    ...mapState({
      hasErrors: state => state.auth.errors.length > 0
      // customized_instrument(state){ return state.auth.customized_instrument}
    }),
    ...mapGetters(['isLoading']) // Trae los getters
  }
}
</script>
