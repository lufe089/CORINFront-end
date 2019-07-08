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
                <span class="text-center" v-html="$t('message.welcome')"></span>
                <p class="text-muted text-center">{{$t("message.message_login_code") }}. {{$t("message.message_ejemplo_login") }}</p>
                <b-form @submit="onSubmit">
                <b-row>
                  <b-col md="4">
                    <b-input-group class="mb-3">
                     <b-input-group-prepend><b-input-group-text><i class="icon-key"></i></b-input-group-text></b-input-group-prepend>
                      <!--<label for="prefix">{{ $t('message.prefijo') }}:</label>-->
                      <b-form-input id="prefix" class="font-md p-2" v-model="obj.prefix" maxlength="12" name="prefix" v-validate="'required'" :placeholder="$t('message.prefijo')" />
                    </b-input-group>
                    <p class="text-danger" v-if="errors.has('prefix')">{{ errors.first('prefix') }}</p>
                  </b-col>
                  <b-col md="1">
                    <h2 class="text-secondary font-2xl font-weight-bold">-</h2>
                  </b-col>
                  <b-col md="7">
                    <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input class="font-md p-2" v-model="obj.access_code" maxlength="12" name="access_code" v-validate="'required'" :placeholder="$t('message.access_key')"/>
                    </b-input-group>
                    <p class="text-danger" v-if="errors.has('access_code')">{{ errors.first('access_code') }}</p>
                  </b-col>
                  <!--<b-col cols="6" class="text-right">
                    <b-button variant="link" class="px-0">Forgot password?</b-button>
                  </b-col>-->
                </b-row>
                <b-button variant="primary" type="submit" class="px-4 float-right">{{$t("message.entrar") }}</b-button>
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
// import api from '@/services/api.js'
// import i18n from '../../lang/config'
// import BDData from '@/common/_BDData.js'

import { LOGIN_ACCESS_CODE } from '@/store/actions.type'
import ErrorsList from '@/components/BusinessLogic/ErrorsList'
import { MAIN_ENCUESTA } from '@/router/routesNames'
import { SET_LOADING } from '@/store/mutations.type'
import { mapGetters } from 'vuex'

export default {
  name: 'LoginAccessCode',
  components: {
    baseLoading: () => import('@/components/BaseComponents/BaseLoading'),
    ErrorsList
  },
  data () {
    return {
      obj: {access_code: '', prefix: ''}
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
      this.$store.dispatch(LOGIN_ACCESS_CODE, this.obj)
        .then(
          () => this.$router.push({ name: MAIN_ENCUESTA }))
    }
  },
  computed: {
    ...mapGetters(['hasErrors', 'isLoading']) // Trae los getters
  }
}
</script>
