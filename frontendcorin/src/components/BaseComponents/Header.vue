<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <small>{{$t('message.profile')}}</small>: {{showProfileText}}
    <b-navbar-nav class="ml-auto">
      <b-nav-item class="d-md-down-none">
       <i class="fa fa-lock"></i> {{$t('message.logout')}}
      </b-nav-item>
    </b-navbar-nav>
    <!-- Ocultar barra pq no sera usada -->
    <!--<button class="navbar-toggler aside-menu-toggler d-md-down-none" type="button" @click="asideToggle">
      <span class="navbar-toggler-icon"></span>
    </button>-->
  </header>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'c-header',
  methods: {
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'profile', 'isAdmin', 'showProfileText']) // Trae los getters
  }
}
</script>
