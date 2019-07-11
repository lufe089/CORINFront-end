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
                stacked="sm"
                :items="items"
                :fields="columns"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                responsive
                @filtered="onFiltered"
        >
          <template slot="name" slot-scope="row">{{row.value.first}} {{row.value.last}}</template>
          <template slot="client_company_name" slot-scope="row">{{row.value? row.value:'--'}}</template>
          <template slot="is_family_company" slot-scope="row">{{row.value?$t("message.yes"):$t("message.no")}}</template>
          <template slot="actions" slot-scope="row">
            <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
            <!-- Ojo el id del button es importante para el metodo que procesa la logica no cambiarlo -->
            <b-button size="sm" id="edit" @click.stop="process(row.item, row.index, $event.target)">
              {{$t('message.edit')}}
            </b-button>
            <b-button size="sm" id="remove" @click.prevent="remove(row.item.id)" variant="danger">
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
        <b-alert :show="modalErrors.length > 0" variant="danger" >
          <ul class="error-messages">
            <li v-for="(value, key) in modalErrors" :key="key">
              <span v-text="value" />
              {{value}}
            </li>
          </ul>
        </b-alert>
       <form @submit.prevent="onSubmit">
        <b-input-group class="mb-3" v-show="isAdmin">
            <b-input-group-prepend>
              <b-input-group-text><i class="icon-grid"></i></b-input-group-text>
            </b-input-group-prepend>
            <b-form-select name="companies" id="companies" v-model="user.company_id" :options="companies"  @change="changeCompany" value-field="id" text-field="name">
              <template slot="first">
                <option :value="null">{{$t('message.seleccion_compania')}}</option>
              </template>
            </b-form-select>
        </b-input-group>
        <b-input-group class="mb-3">
          <b-input-group-prepend>
            <b-input-group-text><i class="icon-grid"></i></b-input-group-text>
          </b-input-group-prepend>
          <b-form-select name="clientes" id="clientes" v-model="user.client_id" :options="clients_by_company" text-field="client_company_name">
             <template slot="first">
                <option :value="null">{{$t('message.seleccion_cliente')}}</option>
            </template>
          </b-form-select>
        </b-input-group>
        <b-input-group class="mb-3">
          <b-input-group-prepend>
            <b-input-group-text><i class="icon-user"></i></b-input-group-text>
          </b-input-group-prepend>
          <input type="text" class="form-control" :placeholder="$t('message.email')" name="email" id="email" v-model="user.email" autocomplete='email'  v-validate="'required|email'">
        </b-input-group>
        <p class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</p>
        <b-input-group class="mb-3">
          <b-input-group-prepend>
            <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
          </b-input-group-prepend>
          <input type="password" class="form-control" :placeholder="$t('message.pwd')" name="pwd" id="pwd" v-model="user.password" v-validate="'required'">
        </b-input-group>
        <b-input-group class="mb-4">
          <b-input-group-prepend>
            <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
          </b-input-group-prepend>
          <input type="password" class="form-control" :placeholder="$t('message.repeatPwd')">
        </b-input-group>
        <b-input-group class="mb-3" v-show="isAdmin">
            <b-input-group-prepend>
              <b-input-group-text><i class="icon-grid"></i></b-input-group-text>
            </b-input-group-prepend>
            <b-form-select name="profiles" id="profiles" v-model="user.profileType" :options="parameters.profiles">
              <template slot="first">
                <option :value="null">{{$t('message.seleccion_perfil')}}</option>
              </template>
            </b-form-select>
        </b-input-group>
       </form>
    </b-modal>
  </b-container>
</template>

<script>
import api from '@/services/api.js'
import i18n from '@/lang/config'
import BDData from '@/common/_BDData'
import { mapGetters } from 'vuex'
import { SET_LOADING, SET_ERROR } from '@/store/mutations.type'
import { FETCH_COMPANIES } from '@/store/actions.type'
import { CLIENT } from '@/store/profiles.type'
const items = []

export default {
  data () {
    return {
      columns: [
        { key: 'email', label: 'Email', sortable: true, class: 'text-center' },
        { key: 'company.name', label: 'Compañía', sortable: true, sortDirection: 'desc' },
        { key: 'client.client_company_name', label: 'Cliente', sortable: true, class: 'text-center' },
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
      items: [],
      user: {},
      modalErrors: [], // para mostrar los errores de creacion/edicion en el modal
      surveyConfig: {},
      clients_by_company: {}
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our columns
      return this.columns
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    },
    ...mapGetters(['companies', 'clients', 'isAdmin', 'isCompany', 'profile', 'currentUser']) // Trae los getters
  },
  async created () {
    // Refresh data llama al listar  y crearObj crea un objeto listo para ser configurado
    this.refreshData()
    this.user = this.clearObj()
  },
  methods: {
    async process (item, index, button) {
      // Metodo que se llama en caso de crear o editar desde los botones de la tabla
      if (button.id === 'edit') {
        // Se le pone la información a los campos del modal con un metodo para copiar
        // los objetos de manera que no se vayan a cambian si el usuario cancela
        this.user = JSON.parse(JSON.stringify(item))
        // Se actualizan los campos para las listas desplegables del cliente con la info de la compañía
        this.consultClients(this.user.company_id)
        this.user.client_id = this.user.client.id
        this.modalInfo.title = i18n.tc('message.edit')
      } else if (button.id === 'create') {
        this.user = this.clearObj()
        this.modalInfo.title = i18n.tc('message.create')
      }
      // Abre el modal modalInfo es el id del modal
      // this.$refs.firstFocus.focus()
      this.modalInfo.visible = true
      // Is admin viene de los getters del store
      if (this.isAdmin) {
        try {
          await this.$store.dispatch(FETCH_COMPANIES)
        } catch (exception) {
          this.modalErrors.push(exception.message)
        }
      } else if (this.isCompany) { // El perfil autenticado es el de una compania
        // FIXME poner la compania
        this.consultClients(1)
      }
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    async consultClients (idCompany) {
      try {
        this.$store.commit(SET_LOADING, true)
        var response = await api.post({idCompany: idCompany}, BDData.endPoints.urlClients)
        // Estuvo exitosa la busqueda
        this.$store.commit(SET_LOADING, false)
        this.clients_by_company = response.data
      } catch (exception) {
        console.error(JSON.stringify(exception.message))
        this.modalErrors.push(exception.message)
        this.$store.commit(SET_LOADING, false)
      }
    },
    changeCompany: function (value) {
      // Si cambia la compañia seleccionada se cambia entonces tambien la lista de clientes en la lista desplegable
      this.consultClients(value)
    },
    clearObj () {
      // Se llama este metodo cuando se selecciona el boton para crear o cuando se guarda para dajar el objeto que tendrá la información preparado
      // Se toma del store el profile para decidir como se ajusta la inicialiacion de valores
      var user = {id: null, email: null, company: null, company_id: null, client_id: null, password: null, profileType: CLIENT}
      // Los usuarios que crea un nueva compañia son iguales a la compañia que los esta creando
      if (this.isCompany) {
        user.company = this.currentUser.company
        user.company_id = this.currentUser.company_id
      }
      // No se agregan mas casos pues si es administrador puede seleccionar y si es cliente o participante no deberia poder ver esta opcion
      return user
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
      try {
        this.$store.commit(SET_LOADING, true)
        // Se limpia el objeto de referencia
        this.clearObj()
        // FIXME organizar el id de la compania cuando sepa como resolver el problema de la sesion
        var response = await api.post({idCompany: 1}, BDData.endPoints.usersByCompany)
        // Estuvo exitosa la busqueda
        if (response.status === 200) {
          this.items = response.data
        } else {
          // Se pone vacio para evitar errores
          this.items = []
        }
      } catch (exception) {
        this.$store.commit(SET_ERROR, exception.message)
      }
      this.$store.commit(SET_LOADING, false)
    },
    onSubmit (evt) {
      // Evita que se cierre
      evt.preventDefault()
      // Se validan los resultados
      this.$validator.validate().then(result => {
        // Si no hay errores
        if (result) {
          /* CREAR UN NUEVO USUARIO */
          // El nombre de usuario y el email se hacen iguales, django necesita el username
          this.user.username = this.user.email
          this.save(this.user, BDData.endPoints.users)
          // this.$root.$emit('bv::hide::modal', 'modalInfo')
        }
      })
    },
    async save (obj, servicePath) {
      try {
        var response = null
        if (obj.id && obj.id !== 0) {
          // FIXME arreglar para que el pwd pueda quedar incompelto
          response = await api.update(obj.id, obj, servicePath)
        } else {
          response = await api.create(obj, servicePath)
        }
        // Fue exitoso
        if (response.status >= 200 && response.status <= 300) {
          alert(i18n.tc('message.guardar_modificar_exito'))
          await this.refreshData()
          this.modalInfo.visible = false
        }
      } catch (exception) {
        this.modalErrors.push(exception.message)
      }
    },
    async remove (id) {
      if (confirm(i18n.tc('message.confirm_delete_message'))) {
        try {
          var response = await api.remove(id, BDData.endPoints.users)
          // Fue exitoso
          if (response.status >= 200 && response.status <= 300) {
            alert(i18n.tc('message.eliminar_exito'))
            await this.refreshData()
          }
        } catch (exception) {
          this.$store.commit(SET_ERROR, exception.message)
        }
      }
    }
  }
}
</script>
<style scoped>
.scaleWidth {
  width: 30%;
  /* text-align: center  */
}
</style>
