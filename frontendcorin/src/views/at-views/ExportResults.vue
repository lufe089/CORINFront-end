<template>
  <b-card>
    <base-loading :isLoading="isLoading"></base-loading>
    <div slot="header">
      <b-row >
        <b-col md="12">
            <strong>{{ $t("message.download_data") }}</strong>
        </b-col>
      </b-row>
    </div>
    <b-row fluid>
      <b-col md="6">
        <b-list-group>
          <b-list-group-item variant="secondary"  class="d-flex justify-content-center">  <div class="font-weight-bold font-lg"> {{ $t("message.download_parametric_data") }} </div></b-list-group-item>
            <b-list-group-item button class="d-flex justify-content-between align-items-center">
              {{ $t("message.items") }}
              <download-excel :fetch= "exportItems"
               :fields = "json_fields_items" :name= "exportFileNames.items">
                <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
              </download-excel>
            </b-list-group-item>
            <b-list-group-item button class="d-flex justify-content-between align-items-center">
              {{ $t("message.clients") }}
              <download-excel
                 :fields = "json_fields_clients" :fetch= "exportClients" :name= "exportFileNames.clients">
                <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
              </download-excel>
            </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col md="6">
        <b-list-group>
          <b-list-group-item variant="secondary"  class="d-flex justify-content-center"><div class="font-weight-bold font-lg"> {{ $t("message.download_answers_data") }} </div></b-list-group-item>
            <b-list-group-item button class="d-flex justify-content-between align-items-center">
              {{ $t("message.all") }}
              <download-excel :fetch="exportResponses"
                :fields = "json_fields_responses" :name= "exportFileNames.responses">
                <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
              </download-excel>
            </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-card>
</template>
<script>

import BDData from './_BDData.js'
import api from './api.js'
import i18n from '../../lang/config'

export default {
  name: 'results-module',
  components: {
    DownloadExcel: () => import('vue-json-excel'),
    baseLoading: () => import('./BaseLoading')
  },
  data () {
    return {
      exportFileNames: BDData.exportFileNames,
      isLoading: false,
      // urlClients: '/clients-and-survey-conf/',
      urlClients: '/clients-and-survey-conf/',
      urlActiveItems: '/activeItemsSpanish/',
      urlResponses: '/consult-responses/',
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
            if (value === null) {
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
  created: function () {
  },
  watch: {
  },
  methods: {
    exportItems: function () {
      var dataToExpert = this.consultData(this.urlActiveItems)
      return dataToExpert
    },
    exportClients: function () {
      // FIXME: arreglar manejo de la compania
      var dataToExpert = this.consultDataPost(this.urlClients, {idCompany: 1})
      return dataToExpert
    },
    exportResponses: function () {
      var dataToExpert = this.consultDataPost(this.urlResponses, {idCompany: 1})
      return dataToExpert
    },
    async consultData (url) {
      this.isLoading = true
      var response = await api.getAll(url)
      // Estuvo exitosa la busqueda
      if (response.status === 200) {
        this.isLoading = false
        return response.data
      } else {
        // Se pone vacio para evitar errores
        this.isLoading = false
        return {}
      }
    },
    async consultDataPost (url, data) {
      // FIXME
      var response = await api.getWithPost(data, url)
      // Estuvo exitosa la busqueda
      this.isLoading = true
      if (response.status === 200) {
        this.isLoading = false
        return response.data
      } else {
        // Se pone vacio para evitar errores
        this.isLoading = false
        // FIXME
        return {}
      }
    }
  }
}
</script>
