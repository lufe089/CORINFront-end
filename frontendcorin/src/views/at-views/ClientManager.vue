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
        <b-col md="6" class="my-1">
          <b-form-group horizontal :label="$t('message.peer_page')" class="mb-0">
            <b-form-select :options="pageOptions" v-model="perPage" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>

    <b-card class="card-body">
      <b-row> <b-col>
        <!-- Create button -->
        <b-button type="submit" size="m" variant="primary" class="float-right my-1" id="create" @click.stop="process(none, none, $event.target)">
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
                :fields="fields"
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
            <b-button size="sm" id="remove" @click.prevent="remove(row.item.id)" variant="error">
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
    <b-modal id="modalInfo"  ref="modalCreateUpdate" @hide="resetModal" @ok="onSubmit" :title="modalInfo.title" >
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
              <b-form-input type="number" name="numberEmployees" id="numberEmployees" v-model="obj.number_employees" v-validate="'required|numeric|min_value:0'"></b-form-input>
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
      fields: [
        { key: 'client_company_name', label: 'Nombre', sortable: true, sortDirection: 'desc' },
        { key: 'constitution_year', label: 'Año constitución', sortable: true, 'class': 'text-center' },
        { key: 'number_employees', label: 'Número de empleados', sortable: true, 'class': 'text-center' },
        { key: 'is_corporate_group', label: 'Grupo corporativo?', sortable: true },
        { key: 'is_family_company', label: 'Companía familiar?', sortable: true },
        { key: 'actions', label: 'Acciones', class: 'scaleWidth, text-center' }
      ],
      currentPage: 1,
      perPage: 10,
      totalRows: items.length,
      pageOptions: BDData.pageOptions,
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalInfo: {title: ''},
      // Real data
      servicePath: 'clients/',
      isBusy: false,
      loading: false,
      items: [],
      // FIXME company id no siempre puede ser uno
      obj: {},
      parameters: BDData.parameters
    }
  },
  async created () {
    this.refreshData()
    this.obj = this.clearObj()
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    }
  },
  methods: {
    process (item, index, button) {
      // this.modalInfo.title = `Row index: ${index}`
      // Metodo que se llama en caso de crear o editar
      if (button.id === 'edit') {
        // Se le pone la información a los campos del modal con un metodo para copiar
        // los objetos de manera que no se vayan a cambian si el usuario cancela
        this.obj = JSON.parse(JSON.stringify(item))
        this.modalInfo.title = i18n.tc('message.edit')
      } else if (button.id === 'create') {
        // this.obj = this.obj // FIXME
        this.obj = this.clearObj()
        this.modalInfo.title = i18n.tc('message.create')
      }
      // Abre el modal modalInfo es el id del modal
      // this.$refs.firstFocus.focus()
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    clearObj () {
      var obj = {id: null, company_id: 1, client_company_name: null, constitution_year: null, number_employees: null, is_corporate_group: null, is_family_company: null}
      return obj
      // this.obj.id = null
      // this.obj.company_id = 1
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
      console.log(this.items)
      this.loading = false
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
  width: 30%;
  /* text-align: center  */
}
</style>
