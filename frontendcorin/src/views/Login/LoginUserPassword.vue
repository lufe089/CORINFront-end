<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <errors-list></errors-list>
        <base-loading :isLoading="isLoading"></base-loading>
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form @submit="onSubmit">
                  <h1>{{$t('message.login')}}</h1>
                  <p class="text-muted"><small>{{$t('message.iniciar_sesion_msj')}}</small></p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('message.email')" v-model="obj.email" name="email" v-validate="'required'">
                    <p class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</p>
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <input type="password" class="form-control" :placeholder="$t('message.pwd')" v-model="obj.password" name="password" v-validate="'required'">
                    <p class="text-danger" v-if="errors.has('password')">{{ errors.first('password') }}</p>
                  </b-input-group>
                  <b-row>
                    <b-col cols="12">
                      <b-button variant="primary" class="px-4 float-right" type="submit">{{$t("message.entrar") }}</b-button>
                    </b-col>
                    <!--<b-col cols="6" class="text-right">
                      <b-button variant="link" class="px-0">Forgot password?</b-button>
                    </b-col>-->
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <!--<b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <b-button variant="primary" class="active mt-3">Register Now!</b-button>
                </div>
              </b-card-body>
            </b-card>-->
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { LOGIN_PWD } from '@/store/actions.type'
import ErrorsList from '@/components/BusinessLogic/ErrorsList'
import { RESULTS_BY_CATEGORIES } from '@/router/routesNames'
import { mapGetters } from 'vuex'
import { CLEAR_ERRORS } from '@/store/mutations.type'

export default {
  name: 'LoginUserPwd',
  components: {
    baseLoading: () => import('@/components/BaseComponents/BaseLoading'),
    ErrorsList
  },
  data () {
    return {
      obj: {email: '', password: ''}
    }
  },
  mounted: function () {
    this.$store.commit(CLEAR_ERRORS)
  },
  methods: {
    onSubmit: function (evt) {
      // the page doesn’t reload when the form is submitted,
      evt.preventDefault()
      // Se validan los resultados
      this.$validator.validate().then(result => {
        // Si no hay errores
        if (result) {
          // Se llama la action que controla el login del store
          // Actions are triggered with the store.dispatch method:
          this.login()
        }
      })
    },
    async login () {
      /* En el store se hace el manejo de los errores */
      await this.$store.dispatch(LOGIN_PWD, this.obj)
      if (!this.isParticipant && !this.hasErrors) {
        this.$router.push({ name: RESULTS_BY_CATEGORIES })
      }
    }
  },
  computed: {
    ...mapGetters(['hasErrors', 'isLoading', 'isParticipant']) // Trae los getters
  }
}
</script>
