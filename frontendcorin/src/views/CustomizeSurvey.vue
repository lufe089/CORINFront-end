<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <client-selector @client-selector:change='refreshData'></client-selector>
      </b-col>
    </b-row>
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
              <ckeditor :editor="editor" v-model="obj.custom_user_instructions"></ckeditor>
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
              <ckeditor :editor="editor" v-model="obj.custom_contact_info"></ckeditor>
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
                <ckeditor :editor="editor" v-model="obj.custom_thanks"></ckeditor>
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
import api from '@/services/api.js'
import i18n from '@/lang/config'
import BDData from '@/common/_BDData.js'

import { SET_LOADING, SET_ERROR, CLEAR_ERRORS } from '@/store/mutations.type'
import { mapGetters } from 'vuex'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CKEditor from '@ckeditor/ckeditor5-vue'

export default {
  components: {
    clientSelector: () => import('@/components/BusinessLogic/ClientSelector'),
    ckeditor: CKEditor.component
    /* Documentacion del componente https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/vuejs.html */
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
      obj: {},
      idClient: null,
      showData: false,
      editor: ClassicEditor
    }
  },
  async created () {
    // Si es un cliente entonces llama a refrescar los datos con el id del cliente autenticado
    // si es una compañía o el administrador, estos datos provienen de la selección de la lista desplegable
    if (this.isClient) {
      this.refreshData(this.currentUser.idClient)
    }
  },
  mounted: function () {
    this.$store.commit(CLEAR_ERRORS)
  },
  computed: {
    ...mapGetters(['currentUser', 'isAdmin', 'isCompany', 'isParticipant', 'isClient', 'customizedInstrument', 'hasErrors', 'isLoading']) // Trae los getters
  },
  methods: {
    async refreshData (idClient) {
      this.$store.commit(SET_LOADING, true)
      this.showData = false // Se ocultan los datos del cliente anterior
      this.idClient = idClient
      let dataConsult = {idClient: idClient} // let hace que exista solo scope de bloque
      try {
        let response = await api.post(dataConsult, BDData.endPoints.ulrInstructions)
        // Estuvo exitosa la busqueda
        if (response.status === 200) {
          this.obj = response.data
          // Se verifica que no hayan errores en la respuesta
          if (this.obj.error === undefined) {
            this.showData = true
            this.$store.commit(CLEAR_ERRORS)
          } else if (this.obj.error === 'config_survey') {
            this.showData = false
            this.$store.commit(SET_ERROR, i18n.tc('message.error_configuracion_cliente'))
          } else if (this.obj.error === 'no_customized_instrument') {
            // Se deja todo disponible para personalizar la encuesta
            // usando los datos que se reciben de la base de datos
            this.showData = true
          }
        }
      } catch (exception) {
        // Se pone vacio para evitar errores
        this.obj = {}
        this.$store.commit(SET_ERROR, exception.message)
      }
      this.$store.commit(SET_LOADING, false)
    },
    onSubmit (evt) {
      // Evita que se cierre
      evt.preventDefault()
      // Se validan los resultados
      this.$validator.validate().then(result => {
        // Si no hay errores en el front-end
        if (result) {
          this.save(this.obj, BDData.endPoints.customizedInstrument)
        }
      })
    },
    async save (obj, servicePath) {
      try {
        this.$store.commit(SET_LOADING, true)
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
      } catch (exception) {
        this.$store.commit(SET_ERROR, i18n.tc('message.error_configuracion_cliente'))
      }
      this.$store.commit(SET_LOADING, false)
    }
  }
}
</script>
<style scoped>
.scaleWidth {
  width: 40%;
  /* text-align: center  */
}
.customForm {
  display: flex;
  flex-direction:column;
}
</style>
