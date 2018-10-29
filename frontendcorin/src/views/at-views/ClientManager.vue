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
        <b-col>
        <!-- Create button -->
        <b-button type="submit" size="m" variant="primary" class="float-right my-1" id="create" @click.stop="process(null, null, $event.target)">
          <i class="fa icon-plus"></i> {{ $t("message.create") }}
        </b-button>
      </b-col>
      </b-row>
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
            <b-button size="sm" id="edit" @click.stop="process(row.item, row.index, $event.target)">
              {{$t('message.edit')}}
            </b-button>
            <b-button size="sm" id="configSurvey" @click.prevent="loadConfigSurveys(row.item,row.index)" variant="secondary">
              {{$t('message.configure')}}
            </b-button>
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
    <!-- Info modal ok-only solo mostraria el boton de ok-->
    <b-modal id="modalInfo"  ref="modalCreateUpdate" @hide="resetModalInfo" @ok="onSubmit" :title="modalInfo.title" lazy v-show="modalInfo.visible">
       <form @submit.prevent="onSubmit">
        <b-form-group :class="{'has-error': errors.has('company')}">
          <label for="company">{{$t("message.name") }}</label>
          <!-- <b-form-input type="text" id="company" class="form-control-warning" ref="firstFocus" v-model="obj.client_company_name" :placeholder="$t('message.please_enter_company_name')" v-validate="obj.client_company_name" data-rules="required"></b-form-input>-->
          <b-form-input type="text" id="company" name="company" class="form-control-warning" ref="firstFocus" v-model="obj.client_company_name" :placeholder="$t('message.please_enter_company_name')" v-validate="'required'"></b-form-input>
          <p class="text-danger" v-if="errors.has('company')">{{ errors.first('company') }}</p>
        </b-form-group>
        <b-row>
          <b-col md="6">
            <b-form-group>
              <label for="numberEmployees">{{$t("message.number_employees") }}</label>
              <b-form-input type="number" name="numberEmployees" id="numberEmployees" v-model="obj.number_employees" v-validate="'required|numeric|min_value:1'"></b-form-input>
              <p class="text-danger" v-if="errors.has('numberEmployees')">{{ errors.first('numberEmployees') }}</p>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group>
              <label for="constitutionYear">{{$t("message.constitution_year") }}</label>
              <b-form-input type="number" name="constitutionYear" id="constitutionYear" v-model="obj.constitution_year" v-validate="'required|numeric|min_value:1900'"></b-form-input>
              <p class="text-danger" v-if="errors.has('constitutionYear')">{{ errors.first('constitutionYear') }}</p>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group :label="$t('message.corporative_group')" label-for="corporativeGroup" :label-cols="6">
                <b-form-radio-group id="corporativeGroup" name="corporativeGroup" v-model="obj.is_corporate_group" :options="parameters.yes_no"  v-validate="'required'"></b-form-radio-group>
                <p class="text-danger" v-if="errors.has('corporativeGroup')">{{ errors.first('corporativeGroup') }}</p>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group :label="$t('message.type_of_company_client')" label-for="familyCompany" :label-cols="6">
              <b-form-radio-group id="familyCompany" v-model="obj.is_family_company" :options="parameters.yes_no" name="familyCompany" v-validate="'required'"></b-form-radio-group>
              <p class="text-danger" v-if="errors.has('familyCompany')">{{ errors.first('familyCompany') }}</p>
            </b-form-group>
          </b-col>
        </b-row>
        <!-- Footer del modal que al final no lo use pq personalice el fondo
        <b-row>
          <b-col md="12">
          <template  slot="modal-ok">
             <b-button type="submit" size="m" variant="primary" slot="modal-ok">
              <i class="fa fa-dot-circle-o"></i> {{ $t("message.continue") }}</b-button>
          </template>

          <div slot="modal-footer" class="w-100 float-right">
            <b-button type="submit" class="x-2 p-1" size="sm" variant="primary">
              <i class="fa fa-dot-circle-o"></i> {{ $t("message.continue") }}</b-button>
            <b-button size="sm" class="p-1" @click="show=false">
              <i class="fa fa-dot-circle-o"></i> {{ $t("message.cancel") }}</b-button>
            <span class="p-2"></span>
          </div>
          </b-col>
        </b-row>-->
       </form>
    </b-modal>
    <!-- Modal to configure a survey for a client -->
    <b-modal id="modalConfigSurvey"  ref="modalConfigSurvey" @ok="onSubmit" :title="modalConfigSurvey.title" v-show="modalConfigSurvey.visible" lazy>
       <form @submit.prevent="onSubmit">
        <b-row>
          <b-col md="12">
            <div class="h6 text-info mb-0 pt-1 float-right">
              {{$t("message.used_surveys") }}
              <strong><vue-numeric v-bind:precision="0" class="text-muted" read-only v-model="surveyConfig.used_surveys"></vue-numeric></strong>
              <hr/>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label for="maxSurveys">{{$t("message.max_surveys") }}</label>
              <b-form-input type="number" name="maxSurveys" id="maxSurveys" v-model="surveyConfig.max_surveys" v-validate="{required: true, numeric: true, min_value:surveyConfig.used_surveys }"></b-form-input>
              <p class="text-danger" v-if="errors.has('maxSurveys')">{{ errors.first('maxSurveys') }}</p>
            </b-form-group>
          </b-col>
        </b-row>
        <!--
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label for="survey_conf_desc">{{$t("message.survey_conf_desc") }}</label>
              <b-form-input type="text" id="survey_conf_desc" name="survey_conf_desc" class="form-control-warning"  v-model="surveyConfig.survey_conf_desc" :placeholder="$t('message.please_enter_config_description')"></b-form-input>
              <p class="text-danger" v-if="errors.has('survey_conf_desc')">{{ errors.first('survey_conf_desc') }}</p>
            </b-form-group>
          </b-col>
        </b-row> -->
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
      currentPage: 1,
      perPage: 10,
      totalRows: items.length,
      parameters: BDData.parameters,
      pageOptions: BDData.pageOptions,
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalInfo: {title: '', visible: false},
      modalConfigSurvey: {title: '', visible: false},
      // Real data
      servicePath: 'clients/',
      surveyConfigPath: 'configSurveys/',
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
        this.modalInfo.title = i18n.tc('message.edit')
      } else if (button.id === 'create') {
        this.obj = this.clearObj()
        this.modalInfo.title = i18n.tc('message.create')
      }
      // Abre el modal modalInfo es el id del modal
      // this.$refs.firstFocus.focus()
      this.modalInfo.visible = true
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    clearObj () {
      // FIXME: company_id no puede ser siempre uno.
      // Se llama este metodo cuando se selecciona el boton para crear o cuando se guarda para dajar el objeto que tendrá la información preparado
      var obj = {id: null, company_id: 1, client_company_name: null, constitution_year: null, number_employees: null, is_corporate_group: null, is_family_company: null}
      return obj
    },
    clearSurveyConf () {
      // FIXME instrument_header_id no debería ser siempre 1
      var obj = {id: null, client_id: null, instrument_header_id: 1, max_surveys: null, used_surveys: 0}
      return obj
    },
    resetModalInfo () {
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
      var urlService = 'clients-and-survey-conf'
      var response = await api.getAll(urlService)
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
      this.modalConfigSurvey.visible = true
      // Se pasan los datos a la configuracion
      this.surveyConfig.id = item.config_id
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
          if (evt.target.id === 'modalInfo') {
            this.save(this.obj, this.servicePath)
            // this.$root.$emit('bv::hide::modal', 'modalInfo')
          } else {
            this.save(this.surveyConfig, this.surveyConfigPath)
            // this.$root.$emit('bv::hide::modal', 'modalConfigSurvey')
          }
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
        await this.refreshData()
        this.modalInfo.visible = false
        this.modalConfigSurvey.visible = false
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
  width: 30%;
  /* text-align: center  */
}
</style>
