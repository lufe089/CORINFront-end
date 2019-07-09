<template>
  <div>
  <b-card :no-body="true">
    <b-card-body class="p-3 clearfix">
      <b-row>
        <b-col md="1" class="text-center">
          <i class="fa icon-user bg-dark text-white p-3 font-2xl mr-1 "></i>
        </b-col>
        <b-col md="11">
            <div class="h5 text-dark mb-0 mt-2" v-show="showSelector">
            <b-form-group :description="$t('message.seleccion_cliente')" :label="$t('message.cliente')" label-for="clientInput" :label-cols="1"
              :horizontal="true" >
              <b-form-select id="clientInput" v-model="idClient" :options="clients_by_company"  @change="changeClient" required/>
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
import { ADMIN, COMPANY } from '@/store/profiles.type'
import { SET_LOADING, SET_ERROR } from '@/store/mutations.type'

export default {
  name: 'client-selector',
  components: {
  },
  data () {
    return {
      idClient: null, // Controla para que cliente ser hará la consulta de los datos
      clients_by_company: [],
      id_company: 1 // FIXME Esto tiene que venir luego del logino algo asi
    }
  },
  created: function () {
    this.consultClients({idCompany: this.id_company}, BDData.endPoints.urlClients)
  },
  methods: {
    async consultClients (data, path) {
      try {
        this.$store.commit(SET_LOADING, true)
        var response = await api.post(data, path)
        // Estuvo exitosa la busqueda
        this.$store.commit(SET_LOADING, false)
        this.clients_by_company = response.data
      } catch (exception) {
        console.error(JSON.stringify(exception.message))
        this.$store.commit(SET_ERROR, exception.message)
        this.$store.commit(SET_LOADING, false)
      }
    },
    changeClient: function (value) {
      // Se emite del cambio al componente padre
      this.$emit('client-selector:change', value)
    }
  },
  computed: {
    showSelector: function () {
      // El selector se muestra si es adminstrador o si es compañia
      // profile sale del store
      if (this.profile === COMPANY || this.profile === ADMIN) {
        return true
      } else {
        return false
      }
    },
    ...mapGetters(['profile']) // Trae los getters
  }
}
</script>
