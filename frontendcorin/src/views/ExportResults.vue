<template>
  <b-card>
    <div slot="header">
      <b-row >
        <b-col md="12">
            <strong>{{ $t("message.download_data") }}</strong>
        </b-col>
      </b-row>
    </div>
    <!-- Mensaje de informacion -->
      <b-row md="12">
        <b-col lg="12">
            <b-card v-show="showInfoMessage"
                  header-tag="header"
                  footer-tag="footer">
                  <b-alert show variant="info">
                    <h4 class="alert-heading">{{ $t("message.download_no_data_title") }}</h4>
                    <hr>
                    <p>
                      {{$t('message.download_no_data')}}
                    </p>
                  </b-alert>
            </b-card>
        </b-col>
      </b-row>
    <b-row fluid>
      <!-- questions -->
      <b-col md="12" v-show="isAdmin">
        <b-list-group >
          <b-list-group-item variant="secondary"  class="d-flex justify-content-center">  <div class="font-weight-bold font-lg"> {{ $t("message.download_parametric_data") }} </div></b-list-group-item>
            <b-list-group-item button class="d-flex justify-content-between align-items-center">
              {{ $t("message.items") }}
              <download-excel :fetch= "exportItems"
               :fields = "json_fields_items" :name= "exportFileNames.items">
                <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
              </download-excel>
            </b-list-group-item>
        </b-list-group>
      </b-col>
      <!-- lista de clientes -->
      <b-col md="12" v-show="isAdmin || isCompany">
        <b-list-group >
          <b-list-group-item variant="secondary"  class="d-flex justify-content-center"><div class="font-weight-bold font-lg"> {{ $t("message.download_clients") }} </div></b-list-group-item>
            <b-list-group-item button class="d-flex justify-content-between align-items-center">
              <b-input-group class="mb-12" v-show="isAdmin">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-grid"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-select v-model="idCompany" :options="companies"  value-field="id" text-field="name">
                    <template slot="first">
                      <option :value="null">{{$t('message.seleccion_compania')}}</option>
                    </template>
                  </b-form-select>
              </b-input-group>
              <!-- Cuando se seleccione para que empresa se van a descargar los clientes se habilita la opcion -->
              <span v-show="idCompany != null" class="mb-12">
                {{$t('message.clients')}}
               <download-excel
                  :fields = "json_fields_clients" :fetch= "exportClients" :name= "exportFileNames.clients">
                  <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
               </download-excel>
              </span>
            </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <!-- Results -->
    <b-row fluid>
      <b-col md="12">
        <b-list-group>
          <b-list-group-item variant="secondary"  class="d-flex justify-content-center"><div class="font-weight-bold font-lg"> {{ $t("message.download_answers_data") }} </div>
          </b-list-group-item>
        </b-list-group>
        <b-list-group>
          <!-- Respuestas de un cliente particular seleccionado en la lista desplegable o del cliente autenticado -->
          <b-list-group-item button class="d-flex justify-content-between align-items-center">
              <b-row>
                <b-col  md="12">
                  <b-input-group v-show="isAdmin || isCompany" class="mb-12">
                    <b-input-group-prepend>
                      <b-input-group-text><i class="icon-grid"></i></b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-select v-model="idClient" :options="clients" value-field="id" text-field="client_company_name" @change="refresh">
                      <template slot="first">
                        <option :value="null">{{$t('message.seleccion_cliente')}}</option>
                      </template>
                    </b-form-select>
                  </b-input-group>
                </b-col>
                <b-col md="12">
                <div v-show="idClient != null" >
                  {{$t('message.download_answers_by_client_id')}}
                  <download-excel :fetch="exportResponses"
                    :fields = "json_fields_responses" :name= "exportFileNames.responses">
                    <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
                  </download-excel>
                </div>
                </b-col>
              </b-row>
          </b-list-group-item>
           <!-- Todas las respuestas para todos los clientes -->
          <b-list-group-item button class="d-flex justify-content-between align-items-center">
              <span v-show="isAdmin">
              {{ $t("message.all") }}
              <download-excel :fetch="exportResponses"
                :fields = "json_fields_responses" :name= "exportFileNames.responses">
                <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
              </download-excel>
              </span>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-card>
</template>
<script>

import BDData from '@/common/_BDData.js'
import { FETCH_COMPANIES } from '@/store/actions.type'
import api from '@/services/api.js'
import i18n from '@/lang/config'
import { mapGetters } from 'vuex'
import { SET_LOADING, SET_ERROR, CLEAR_ERRORS } from '@/store/mutations.type'

export default {
  name: 'results-module',
  components: {
    DownloadExcel: () => import('vue-json-excel'),
    clientSelector: () => import('@/components/BusinessLogic/ClientSelector')
  },
  data () {
    return {
      exportFileNames: BDData.exportFileNames,
      idClient: null,
      idCompany: null,
      showInfoMessage: false, // controla si se muestra mensajes informativos
      clients: [], // Para la lista desplegable del adminstrador y de la compañia
      // urlClients: '/clients-and-survey-conf/',
      /* json_fields: {
        'Complete name': 'name',
        'City': 'city',
        'Telephone': 'phone.mobile',
        'Telephone 2': {
          field: 'phone.landline',
          callback: (value) => {
            return `Landline Phone - ${value}`
          }
        }
      }, */
      json_fields_items: {
        'Pregunta_id': 'id',
        'Descripción': 'name',
        'Dimensión': 'item.dimension.name',
        'Categoría': 'item.category.name',
        'Componente': {
          field: 'item.component',
          callback: (value) => {
            if (value === '') {
              return '----'
            } else {
              return value.name
            }
          }
        }
      },
      json_fields_clients: {
        'Cliente': 'client_company_name',
        'Identificación': 'identification',
        'Año de constitución': 'constitution_year',
        'Número de empleados': 'number_employees',
        'Grupo coorporativo?': {
          field: 'is_corporate_group',
          callback: (value) => {
            if (value === '') { // asi llega el false
              return i18n.tc('message.no')
            } else {
              return i18n.tc('message.yes')
            }
          }},
        'Grupo familiar?': {
          field: 'is_family_company',
          callback: (value) => {
            if (value === '') { // asi llega el false
              return i18n.tc('message.no')
            } else {
              return i18n.tc('message.yes')
            }
          }},
        'Número máximo de encuestas': 'max_surveys',
        'Encuestas aplicadas': 'used_surveys'
      },
      json_fields_responses: {
        'Pregunta_id': 'pregunta_id',
        'Respuesta': 'answer_numeric',
        'Participante_id': 'participant_id',
        'Email': 'participant_email',
        'Área': 'area',
        'Directivo?': {
          field: 'is_directive',
          callback: (value) => {
            if (value === '') { // asi llega el false
              return i18n.tc('message.no')
            } else {
              return i18n.tc('message.yes')
            }
          }},
        'Cliente_id': 'client_id',
        'Cliente_nombre': 'client_name'
      },
      json_meta: [
        [
          {
            'key': 'charset',
            'value': 'utf-8'
          }
        ]
      ]
    }
  },
  async mounted () {
    this.$store.commit(CLEAR_ERRORS)
    if (this.isClient) {
      // Se inicializa el cliente a partir del cliente del usuario autenticado
      this.idClient = this.currentUser.client_id
      this.idCompany = this.currentUser.company_id //
    } else if (this.isCompany) {
      this.idCompany = this.currentUser.company_id
      this.idClient = null // Se debe seleccionar de la lista desplegable
      let dataConsult = {}
      dataConsult.idCompany = this.currentUser.company_id
      dataConsult.isClient = this.isClient // tomado del store
      dataConsult.isAdmin = this.isAdmin // tomado del store
      dataConsult.isCompany = this.isCompany // tomado del store
      this.clients = await this.consult(dataConsult, BDData.endPoints.urlClients, 'post')
    } else if (this.isAdmin) {
      this.idCompany = null // Se deben seleccionar de la lista desplegable
      this.idClient = null // Se deben seleccionar de la lista desplegable
      // El id de la compania es null para que la consulta retorne todos los clientes
      let dataConsult = {}
      dataConsult.idCompany = this.idCompany
      dataConsult.isClient = this.isClient // tomado del store
      dataConsult.isAdmin = this.isAdmin // tomado del store
      dataConsult.isCompany = this.isCompany // tomado del store
      try {
        await this.$store.dispatch(FETCH_COMPANIES)
      } catch (exception) {
        this.$store.commit(SET_ERROR, exception.message)
        this.$store.commit(SET_LOADING, false)
      }
      this.clients = await this.consult(dataConsult, BDData.endPoints.urlClients, 'post')
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters(['isAdmin', 'isCompany', 'isParticipant', 'isClient', 'hasErrors', 'currentUser', 'companies']) // Trae los getters
  },
  methods: {
    changeClientAnswers: function (idClient) {
      // Se actualiza el id del cliente que sirve para identificar para que cliente se descargarán los datos
      this.idClient = this.currentUser.client_id
      this.showInfoMessage = false
    },
    async consult (data, path, method = 'post') {
      try {
        this.showInfoMessage = false
        var response = null
        this.$store.commit(SET_LOADING, true)
        if (method === 'post') {
          response = await api.post(data, path)
        } else if (method === 'get') {
          response = await api.getAll(path)
        }
        // Estuvo exitosa la busqueda
        this.$store.commit(SET_LOADING, false)
        if (response.data.length === 0) {
          // Se habilita la bandera para que muestre que no hay mensajes que descargar
          this.showInfoMessage = true
        }
        return response.data
      } catch (exception) {
        console.error(JSON.stringify(exception.message))
        this.$store.commit(SET_ERROR, exception.message)
        this.$store.commit(SET_LOADING, false)
      }
    },
    async exportItems () {
      let items = await this.consult({}, BDData.endPoints.urlActiveItems, 'get')
      return items
    },
    async exportClients () {
      // Segun el perfil
      let dataConsult = {}
      if (this.isAdmin) {
        // Para que se busquen todos los clientes de todas las companias
        dataConsult.idCompany = null
      } else if (this.isCompany) {
        // La compania del usuario autenticado
        dataConsult.idCompany = this.currentUser.company_id
      }
      dataConsult.isClient = this.isClient // tomado del store
      dataConsult.isAdmin = this.isAdmin // tomado del store
      dataConsult.isCompany = this.isCompany // tomado del store
      var dataToExport = await this.consult(dataConsult, BDData.endPoints.urlClients)
      return dataToExport
    },
    async exportResponses () {
      // Controla las respuestas que se exportan segun los permisos y la peticion recibida
      var dataConsult = {}
      // el cliente seleccionado en la lista desplegable o el de la sesion configurado cuando se monta el componente
      // puede ser null entonces se traerian todas las respuestas de todos los clientes
      dataConsult.idClient = this.idClient
      dataConsult.idCompany = this.idCompany
      dataConsult.isClient = this.isClient // tomado del store
      dataConsult.isAdmin = this.isAdmin // tomado del store
      dataConsult.isCompany = this.isCompany // tomado del store
      var dataToExport = await this.consult(dataConsult, BDData.endPoints.urlResponses)
      if (dataToExport.length === 0) {
        console.error('ningun resultado')
        return [] // Lista vacia para que no hayan errores en el caso en el qe no hayan datos que exportar
      } else {
        return dataToExport
      }
    },
    refresh: function () {
      this.showInfoMessage = false
    }
  }
}
</script>
