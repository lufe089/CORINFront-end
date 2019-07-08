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
import nav from '../_nav'
import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '@/components/BaseComponents'
import ErrorsList from '@/components/BusinessLogic/ErrorsList'
import { mapGetters } from 'vuex'
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
    ...mapGetters(['isLoading']) // Trae los getters
  }
}
</script>
