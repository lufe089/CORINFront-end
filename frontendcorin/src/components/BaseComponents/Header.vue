<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div><small>
      {{ currentUser.email }}
      <div><strong>{{$t('message.profile')}}</strong>: {{showProfileText}} <strong><br> {{clientName}} </strong></div>
    </small></div>
    <!-- Cuando es participante no muestra la opcion de logout -->
    <b-navbar-nav class="ml-auto" @click="logout"  v-show="!isParticipant">
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
import { LOGOUT } from '@/store/actions.type'
import { LOGIN_BY_PASSWORD } from '@/router/routesNames'

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
    },
    logout () {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({ name: LOGIN_BY_PASSWORD })
      })
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'profile', 'isAdmin', 'showProfileText', 'currentUser', 'isParticipant', 'clientName']) // Trae los getters
  }
}
</script>
