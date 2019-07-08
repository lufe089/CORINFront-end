<template>
  <div>
  <base-loading :isLoading="isLoading"></base-loading>
  <b-card :no-body="true">
    <b-card-body class="p-3 clearfix">
      <b-row>
        <b-col md="1" class="text-center">
          <i class="fa icon-user bg-dark text-white p-3 font-2xl mr-1 "></i>
        </b-col>
        <b-col md="11">
            <div class="h5 text-dark mb-0 mt-2">
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
export default {
  name: 'client-selector',
  components: {
    baseLoading: () => import('@/components/BaseComponents/BaseLoading')
  },
  data () {
    return {
      urlClients: '/clients-and-survey-conf/', // Controla cual es la ruta para la que se quieren ver los resultados,
      idClient: null, // Controla para que cliente ser hará la consulta de los datos
      isLoading: true,
      clients_by_company: [],
      id_company: 1 // FIXME Esto tiene que venir luego del logino algo asi
    }
  },
  created: function () {
    this.consultClients({idCompany: this.id_company}, this.urlClients)
  },
  methods: {
    async consultClients (data, path) {
      var response = await api.post(data, path)
      // Estuvo exitosa la busqueda
      if (response.status === 200) {
        this.isLoading = false
        this.clients_by_company = response.data
      } else {
        this.isLoading = false
      }
    },
    changeClient: function (value) {
      // Se emite del cambio al componente padre
      this.$emit('client-selector:change', value)
    }
  }
}
</script>
