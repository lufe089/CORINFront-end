<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
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
                    <input type="password" class="form-control" :placeholder="$t('message.pwd')" v-model="obj.pwd" name="pwd" v-validate="'required'">
                    <p class="text-danger" v-if="errors.has('pwd')">{{ errors.first('pwd') }}</p>
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
import { MAIN_ENCUESTA } from '@/router/routesNames'
import { SET_LOADING } from '@/store/mutations.type'
import { mapGetters } from 'vuex'

export default {
  name: 'LoginUserPwd',
  components: {
    baseLoading: () => import('@/components/BaseComponents/BaseLoading'),
    ErrorsList
  },
  data () {
    return {
      obj: {email: '', pwd: ''}
    }
  },
  methods: {
    onSubmit: function (evt) {
      // the page doesn’t reload when the form is submitted,
      this.$store.commit(SET_LOADING, true)
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
      this.$store.dispatch(LOGIN_PWD, this.obj)
        .then( // FIXME para despachar según el perfil
          () => this.$router.push({ name: MAIN_ENCUESTA }))
    }
  },
  computed: {
    ...mapGetters(['hasErrors', 'isLoading']) // Trae los getters
  }
}
</script>
