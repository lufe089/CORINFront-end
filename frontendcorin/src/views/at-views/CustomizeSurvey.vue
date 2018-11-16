<template>
  <b-container fluid>
    <loading :isLoading="isLoading"></loading>
    <b-row>
      <b-col md="12">
        <client-selector @client-selector:change='refreshData'></client-selector>
      </b-col>
    </b-row>
    <b-alert variant="danger" :show="error !== ''"><h4>{{error}}</h4></b-alert>
    <div v-show="showData">
    <b-alert variant="warning" :show="obj.id === null"><h4>{{$t("message.no_survey_config")}}</h4></b-alert>
    <form>
      <!-- Control de acceso -->
      <b-card :header="$t('message.access_config')">
        <b-row>
          <b-col md="6" class="my-1" >
            <div class="h5 text-info mb-2 pt-2">
                {{$t("message.access_key") }}
            </div>
            <b-card :no-body="true">
              <b-card-body class="p-0 clearfix align-middle">
                <b-row>
                  <b-col md="2">
                    <div class="bg-light font-xl mr-1 p-2">
                       <h4 class="font-weight-bold">{{obj.prefix}}</h4>
                    </div>
                  </b-col>
                  <b-col md="2">
                    <h4 class="text-secondary font-2xl font-weight-bold">-</h4>
                  </b-col>
                  <b-col md="8">
                    <b-form-input class="font-xl p-2" v-model="obj.access_code" maxlength="12" name="access_code" v-validate="'required'"/>
                    <p class="text-danger" v-if="errors.has('access_code')">{{ errors.first('access_code') }}</p>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col md="6" class="my-1" >
           <div class="h5 text-info mb-2 pt-2">
              {{$t("message.share_link") }}
           </div>
           <b-card :no-body="true">
                <b-card-body class="p-0 mb-0 clearfix ">
                  <i class="fa icon-lock bg-info p-2 px-3 font-2xl mr-1 float-left"></i>
                  <div class="h3 bg-info mb-0 p-2 px-5 font-2xl">{{obj.prefix}}-{{obj.access_code}}</div>
                </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      <b-btn variant="primary" type="submit"  class="float-right"  v-on:click.prevent="onSubmit" >{{$t("message.save")}}</b-btn>
      </b-card>
      <!-- Personalizar mensajes-->
      <b-card :header="$t('message.customization_information')">
        <b-row>
        <!-- Instructions -->
        <b-col md="12" class="my-1" >
          <b-card>
          <div class="customForm">
            <div class="h5 text-info mb-2 pt-2">
              {{$t("message.survey_instructions") }}
            </div>
            <div >
              <trix-editor id='surveyInstructions' inputId="userInstructionsText" v-model="obj.custom_user_instructions"/>
            </div>
          </div>
        </b-card>
        </b-col>
        </b-row>
        <b-row>
        <!-- Contact -->
        <b-col md="12" class="my-1" >
        <b-card>
          <div class="customForm">
            <div class="h5 text-info mb-2 pt-2">
              {{$t("message.contact_information") }}
            </div>
            <div >
              <trix-editor id='surveyContact' inputId="contactText" v-model="obj.custom_contact_info"/>
            </div>
          </div>
        </b-card>
        </b-col>
        </b-row>
        <!-- Thanks -->
        <b-row>
        <b-col md="12" class="my-1" >
          <b-card>
            <div class="customForm">
              <div class="h5 text-info mb-2 pt-2">
                {{$t("message.thanks_information") }}
              </div>
              <div >
                <trix-editor id='surveyThanks' inputId="thanksText" v-model="obj.custom_thanks"/>
              </div>
            </div>
          </b-card>
        </b-col>
        </b-row>
        <b-btn variant="primary" type="submit"  class="float-right"  v-on:click.prevent="onSubmit" >{{$t("message.save")}}</b-btn>
        </b-card>
      </form>
    </div>
  </b-container>
</template>

<script>
import api from './api'
import i18n from '../../lang/config'
import VueTrix from 'vue-trix'

export default {
  components: {
    loading: () => import('./Loading'),
    'trix-editor': VueTrix,
    clientSelector: () => import('./ClientSelector')
  },
  data () {
    return {
      columns: [
        { key: 'client_company_name', label: 'Nombre', sortable: true, sortDirection: 'desc' },
        { key: 'constitution_year', label: 'Año constitución', sortable: true, class: 'text-center' },
        { key: 'number_employees', label: 'Número de empleados', sortable: true, class: 'text-center' },
        { key: 'is_corporate_group', label: 'Grupo corporativo?', sortable: true },
        { key: 'is_family_company', label: 'Companía familiar?', sortable: true },
        { key: 'max_surveys', label: i18n.tc('message.max_surveys'), sortable: true },
        { key: 'used_surveys', label: i18n.tc('message.used_surveys'), sortable: true },
        /* { key: 'survey_conf_desc', label: i18n.tc('message.survey_conf_desc'), sortable: true }, */
        { key: 'actions', label: 'Acciones', class: 'scaleWidth, text-center' }
      ],
      servicePath1: 'consult-custom-inst/',
      servicePath2: 'customizedInstrument/',
      isLoading: false,
      obj: {},
      idClient: null,
      showData: false,
      error: ''
    }
  },
  async created () {
    // Refresh data llama al listar  y crearObj crea un objeto listo para ser configurado
    // this.refreshData()
  },
  computed: {
  },
  methods: {
    async refreshData (idClient) {
      this.idClient = idClient
      this.isLoading = true
      // FIXME: preguntar por el id del cliente correcto
      var data = {idClient: idClient}
      var response = await api.getWithPost(data, this.servicePath1)
      // Estuvo exitosa la busqueda
      if (response.status === 200) {
        this.obj = response.data
        // Se verifica que no hayan errores en la respuesta
        if (this.obj.error === undefined) {
          this.showData = true
          this.error = ''
        } else if (this.obj.error === 'config_survey') {
          this.showData = false
          this.error = i18n.tc('message.error_configuracion_cliente')
        }
      } else {
        // Se pone vacio para evitar errores
        this.obj = {}
      }
      this.isLoading = false
    },
    onSubmit (evt) {
      // Evita que se cierre
      evt.preventDefault()
      // Se validan los resultados
      this.$validator.validate().then(result => {
        // Si no hay errores
        if (result) {
          this.isLoading = true
          this.save(this.obj, this.servicePath2)
          this.isLoading = false
        }
      })
    },
    async save (obj, servicePath) {
      var response = null
      if (obj.id && obj.id !== 0) {
        response = await api.update(obj.id, obj, servicePath)
      } else {
        response = await api.create(obj, servicePath)
      }
      // Fue exitoso
      if (response.status >= 200 && response.status <= 300) {
        alert(i18n.tc('message.guardar_modificar_exito'))
        await this.refreshData(this.idClient)
      }
    }
  }
}
</script>
<style>
.scaleWidth {
  width: 40%;
  /* text-align: center  */
}
.customForm {
  display: flex;
  flex-direction:column;
}
</style>
