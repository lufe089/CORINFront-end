<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-card>
    <b-row>
      <b-col md="6" class="my-1">
          <b-form-group horizontal :label="$t('message.filtro')" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" :placeholder="$t('message.type_to_search')" />
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''">{{$t('message.clear')}}</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6" class="my-1">
          <b-form-group horizontal :label="$t('message.sort')" class="mb-0">
            <b-input-group>
              <b-form-select v-model="sortBy" :options="sortOptions">
                <option slot="first" :value="null">-- -- --</option>
              </b-form-select>
              <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
                <option :value="false">Asc</option>
                <option :value="true">Desc</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" class="my-1">
          <b-form-group horizontal :label="$t('message.peer_page')" class="mb-0">
            <b-form-select :options="pageOptions" v-model="perPage" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>

    <b-card class="card-body">
      <b-row>
        <!-- Main table to list -->
        <b-col md="12">
        <b-table show-empty hover
                stacked="md"
                :items="items"
                :fields="columns"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
        >
          <template slot="name" slot-scope="row">{{row.value.first}} {{row.value.last}}</template>
          <template slot="is_corporate_group" slot-scope="row">{{row.value?$t("message.yes"):$t("message.no")}}</template>
          <template slot="is_family_company" slot-scope="row">{{row.value?$t("message.yes"):$t("message.no")}}</template>
          <template slot="actions" slot-scope="row">
            <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
            <!-- Ojo el id del button es importante para el metodo que procesa la logica no cambiarlo -->
            <!--<b-button size="sm" id="edit" @click.stop="process(row.item, row.index, $event.target)">
              {{$t('message.edit')}}
            </b-button>-->
            <b-button size="sm" id="remove" @click.prevent="remove(row.item.id)" variant="danger" v-show="row.item.used_surveys === 0">
              {{$t('message.delete')}}
            </b-button>
          </template>
          <template slot="row-details" slot-scope="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
              </ul>
            </b-card>
          </template>
        </b-table>
      </b-col>
      </b-row>
      <b-row>
        <b-col md="6" class="my-1">
          <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
        </b-col>
      </b-row>
    </b-card>
    <!-- Modal to configure a survey for a client -->
    <b-modal id="modalConfigSurvey"  ref="modalConfigSurvey" @hide="resetModal" @ok="onSubmit" :title="modalConfigSurvey.title" >
       <form @submit.prevent="onSubmit">
        <b-row>
          <b-col md="12">
            <div class="h6 text-info mb-0 pt-1 float-right">
              {{$t("message.used_surveys") }}
              <strong><vue-numeric v-bind:precision="0" class="text-muted" read-only v-model="obj.used_surveys"></vue-numeric></strong>
              <hr/>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label for="maxSurveys">{{$t("message.max_surveys") }}</label>
              <b-form-input type="number" name="maxSurveys" id="maxSurveys" v-model="obj.max_surveys" v-validate="'required|numeric|min_value:0'"></b-form-input>
              <p class="text-danger" v-if="errors.has('maxSurveys')">{{ errors.first('maxSurveys') }}</p>
            </b-form-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>
  </b-container>
</template>

<script>
import api from './api'
import i18n from '../../lang/config'
import BDData from './_BDData.js'
const items = []

export default {
  data () {
    return {
      columns: [
        { key: 'client.client_company_name', label: 'Nombre', sortable: true, sortDirection: 'desc' },
        { key: 'max_surveys', label: i18n.tc('message.max_surveys'), sortable: true },
        { key: 'used_surveys', label: i18n.tc('message.used_surveys'), sortable: true },
        // { key: 'survey_conf_desc', label: i18n.tc('message.survey_conf_desc'), sortable: true },
        { key: 'actions', label: 'Acciones', class: 'scaleWidth, text-center' }
      ],
      currentPage: 1,
      perPage: 10,
      totalRows: items.length,
      parameters: BDData.parameters,
      pageOptions: BDData.pageOptions,
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalConfigSurvey: {title: '', visible: true},
      // Real data
      servicePath: 'configSurveys/',
      loading: false,
      items: [],
      obj: {},
      surveyConfig: {}
    }
  },
  async created () {
    // Refresh data llama al listar  y crearObj crea un objeto listo para ser configurado
    this.refreshData()
    this.obj = this.clearObj()
  },
  computed: {
    sortOptions () {
      // Create an options list from our columns
      return this.columns
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    }
  },
  methods: {
    process (item, index, button) {
      // Metodo que se llama en caso de crear o editar desde los botones de la tabla
      if (button.id === 'edit') {
        // Se le pone la información a los campos del modal con un metodo para copiar
        // los objetos de manera que no se vayan a cambian si el usuario cancela
        this.obj = JSON.parse(JSON.stringify(item))
        this.modalConfigSurvey.title = i18n.tc('message.edit')
      } else if (button.id === 'create') {
        this.obj = this.clearObj()
        this.modalInfo.title = i18n.tc('message.create')
      }
      // Abre el modal modalInfo es el id del modal
      // this.$refs.firstFocus.focus()
      this.$root.$emit('bv::show::modal', 'modalConfigSurvey', button)
    },
    clearObj () {
      // FIXME: company_id no puede ser siempre uno.
      // Se llama este metodo cuando se selecciona el boton para crear o cuando se guarda para dajar el objeto que tendrá la información preparado
      var obj = {id: null, client_id: null, instrument_header_id: 1, max_surveys: null, used_surveys: null, survey_conf_desc: ''}
      return obj
    },
    resetModal () {
      this.modalInfo.title = ''
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async refreshData () {
      this.loading = true
      // Se limpia el objeto de referencia
      this.clearObj()
      var response = await api.getAll(this.servicePath)
      // Estuvo exitosa la busqueda
      if (response.status === 200) {
        this.items = response.data
      } else {
        // Se pone vacio para evitar errores
        this.items = []
      }
      this.loading = false
    },
    loadConfigSurveys (item, index) {
      // Ir a buscar a la bd si hay configuracion para ese cliente
      // si hay se carga, sino hay se carga una en blanco
      this.surveyConfig = this.clearSurveyConf()
      // Se pone en el titulo el nombre del cliente para el que se quiere configuraar
      this.modalConfigSurvey.title = i18n.tc('message.configure') + ' ' + item.client_company_name
      // Se pasan los datos a la configuracion
      this.surveyConfig.client_id = item.id
      this.surveyConfig.max_surveys = item.max_surveys
      this.surveyConfig.used_surveys = item.used_surveys
      this.surveyConfig.survey_conf_desc = item.survey_conf_desc
      this.$root.$emit('bv::show::modal', 'modalConfigSurvey')
    },
    onSubmit (evt) {
      // Evita que se cierre
      evt.preventDefault()
      // Se validan los resultados
      this.$validator.validate().then(result => {
        // Si no hay errores
        if (result) {
          this.save()
        }
      })
    },
    async save () {
      var response = null
      if (this.obj.id) {
        response = await api.update(this.obj.id, this.obj, this.servicePath)
      } else {
        response = await api.create(this.obj, this.servicePath)
      }
      // Fue exitoso
      if (response.status >= 200 && response.status <= 300) {
        alert(i18n.tc('message.guardar_modificar_exito'))
        await this.refreshData()
        this.$refs.modalCreateUpdate.hide()
      }
    },
    async remove (id) {
      if (confirm(i18n.tc('message.confirm_delete_message'))) {
        var response = await api.remove(id, this.servicePath)
        // Fue exitoso
        if (response.status >= 200 && response.status <= 300) {
          alert(i18n.tc('message.eliminar_exito'))
          await this.refreshData()
        }
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
</style>
