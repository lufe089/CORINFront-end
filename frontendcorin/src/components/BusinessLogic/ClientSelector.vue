<template>
  <div>
  <b-card :no-body="true">
    <!-- El selector de companias esta disponible solo para adminstradores -->
    <b-card-body class="p-3 clearfix" v-show="isAdmin">
      <b-row>
        <b-col md="1" class="text-center">
          <i class="fa icon-grid bg-dark text-white p-3 font-2xl mr-1 "></i>
        </b-col>
        <b-col md="11">
            <div class="h5 text-dark mb-0 mt-2">
            <b-form-group :label="$t('message.compania')" label-for="companyInput" :label-cols="1"
              :horizontal="true" >
              <b-form-select id="companyInput" v-model="idCompany" :options="companies"  @change="changeCompany" required value-field="id" text-field="name">
                <template slot="first">
                <option :value="null">{{$t('message.seleccion_compania')}}</option>
                </template>
              </b-form-select>
              </b-form-group>
            </div>
        </b-col>
      </b-row>
    </b-card-body>
    <b-card-body class="p-3 clearfix" v-show="showSelector">
      <b-row>
        <b-col md="1" class="text-center">
          <i class="fa icon-user bg-dark text-white p-3 font-2xl mr-1 "></i>
        </b-col>
        <b-col md="11">
            <div class="h5 text-dark mb-0 mt-2">
            <b-form-group :label="$t('message.cliente')" label-for="clientInput" :label-cols="1"
              :horizontal="true" >
              <b-form-select id="clientInput" v-model="idClient" :options="clients_by_company"  @change="changeClient" required>
                <template slot="first">
                <option :value="null">{{$t('message.seleccion_cliente')}}</option>
            </template>
              </b-form-select>
              </b-form-group>
            </div>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
  </div>
</template>
<script>
import api from '@/services/api.js'
import BDData from '@/common/_BDData.js'
import { mapGetters } from 'vuex'
import { SET_LOADING, SET_ERROR } from '@/store/mutations.type'

export default {
  name: 'client-selector',
  components: {
  },
  data () {
    return {
      idClient: null, // Controla para que cliente ser hará la consulta de los datos
      clients_by_company: [],
      companies: [],
      idCompany: null
    }
  },
  async mounted () {
    if (this.isCompany) {
      // Se asigna el id de la compañía segun el perfil del usuario autenticado que se consulta en el store
      this.idCompany = this.currentUser.company_id
      let dataConsult = {}
      dataConsult.idCompany = this.currentUser.company_id
      dataConsult.isClient = this.isClient // tomado del store
      dataConsult.isAdmin = this.isAdmin // tomado del store
      dataConsult.isCompany = this.isCompany // tomado del store
      this.clients_by_company = await this.consult(dataConsult, BDData.endPoints.urlClients, 'post')
    }
    if (this.isAdmin) {
      // Se consultan la lista de compañias
      this.companies = await this.consult({}, BDData.endPoints.companies, 'get')
    }
    // No se pone para clientes pq los clientes no deberian ver este componente
  },
  methods: {
    async consult (data, path, method = 'post') {
      try {
        var response = null
        this.$store.commit(SET_LOADING, true)
        if (method === 'post') {
          response = await api.post(data, path)
        } else if (method === 'get') {
          response = await api.getAll(path)
        }
        // Estuvo exitosa la busqueda
        this.$store.commit(SET_LOADING, false)
        return response.data
      } catch (exception) {
        console.error(JSON.stringify(exception.message))
        this.$store.commit(SET_ERROR, exception.message)
        this.$store.commit(SET_LOADING, false)
      }
    },
    changeClient: function (value) {
      // Se emite del cambio al componente padre
      this.$emit('client-selector:change', value)
    },
    async changeCompany (value) {
      if (value === null) {
        this.clients_by_company = []
      } else {
        // Se consultan nuevamente los clientes pero de la compañía seleccionada por el usuairo administrador
        let dataConsult = {}
        dataConsult.idCompany = value
        dataConsult.isClient = this.isClient // tomado del store
        dataConsult.isAdmin = this.isAdmin // tomado del store
        dataConsult.isCompany = this.isCompany // tomado del store
        this.clients_by_company = await this.consult(dataConsult, BDData.endPoints.urlClients)
      }
    }
  },
  computed: {
    showSelector: function () {
      // El selector se muestra si es adminstrador o si es compañia
      // profile sale del store
      if (this.isAdmin || this.isCompany) {
        return true
      } else {
        return false
      }
    },
    ...mapGetters(['profile', 'isAdmin', 'isClient', 'currentUser', 'isCompany']) // Trae los getters
  }
}
</script>
