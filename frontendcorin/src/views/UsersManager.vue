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
                :emptyText = "$t('message.no_resultados')"
                :emptyFilteredText = "$t('message.no_data_filter')"
                responsive
                @filtered="onFiltered"
        >
          <template slot="name" slot-scope="row">{{row.value.first}} {{row.value.last}}</template>
          <template slot="client_company_name" slot-scope="row">{{row.value? row.value:'--'}}</template>
          <template slot="profileType" slot-scope="row">
            {{profileName(row.value)}}
          </template>
          <template slot="actions" slot-scope="row">
            <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
            <!-- Ojo el id del button es importante para el metodo que procesa la logica no cambiarlo -->
            <b-button size="sm" id="edit" @click.stop="process(row.item, row.index, $event.target)">
              {{$t('message.edit')}}
            </b-button>
            <b-button size="sm" id="changePassword" @click.prevent="process(row.item, row.index, $event.target)" variant="secondary">
              {{$t('message.change_password')}}
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
    <!-- Modal para crear usuarios nuevos -->
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
        <div v-show="modalInfo.mode === 'create' || modalInfo.mode === 'edit'">
        <!-- Perfil -->
        <b-input-group class="mb-3" v-show="isVisible('profileType')" >
            <b-input-group-prepend>
              <b-input-group-text><i class="icon-grid"></i></b-input-group-text>
            </b-input-group-prepend>
            <b-form-select name="profileType" id="profileType" v-model="user.profileType" :options="parameters.profiles"
              v-validate="isVisible('profileType')?'required':''">
              <template slot="first">
                <option :value="null">{{$t('message.seleccion_perfil')}}</option>
              </template>
            </b-form-select>
            <p class="text-danger" v-if="errors.has('profileType')">{{ errors.first('profileType') }}</p>
        </b-input-group>
        <!-- Compania -->
        <!-- No Se debe seleccionar la compañía si el admin esta creando otro usuario de tipo admin -->
        <!-- Tampoco cuando es un usuario de una compañía -->
        <b-input-group class="mb-3" v-show="isVisible('companies')">
            <b-input-group-prepend>
              <b-input-group-text><i class="icon-grid"></i></b-input-group-text>
            </b-input-group-prepend>
            <b-form-select name="companies" id="companies" v-model="user.company_id" :options="companies"
            @change="changeCompany" value-field="id" text-field="name" v-validate="isVisible('companies')?'required':''">
              <template slot="first">
                <option :value="null">{{$t('message.seleccion_compania')}}</option>
              </template>
            </b-form-select>
            <p class="text-danger" v-if="errors.has('companies')">{{ errors.first('companies') }}</p>
        </b-input-group>
        <!-- Lista de clientes -->
        <!-- Se debe seleccionar un cliente si un admin o una compañia estan creando un usuario de tipo cliente -->
        <b-input-group class="mb-3" v-show="isVisible('cliente')">
          <b-input-group-prepend>
            <b-input-group-text><i class="icon-grid"></i></b-input-group-text>
          </b-input-group-prepend>
          <b-form-select name="cliente" id="cliente" v-model="user.client_id" :options="clients_by_company" text-field="client_company_name"  v-validate="isVisible('cliente')?'required':''">
             <template slot="first">
                <option :value="null">{{$t('message.seleccion_cliente')}}</option>
            </template>
          </b-form-select>
          <p class="text-danger" v-if="errors.has('cliente')">{{ errors.first('cliente') }}</p>
        </b-input-group>
        <!-- Email -->
        <!-- Para verificar email repetidos https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fbackend&module=%2Fsrc%2Fcomponents%2FBackend.vue  -->
        <b-input-group class="mb-3">
          <b-input-group-prepend>
            <b-input-group-text><i class="icon-user"></i></b-input-group-text>
          </b-input-group-prepend>
          <input type="text" class="form-control" :placeholder="$t('message.email')" name="email" id="email" v-model="user.email" autocomplete='email'  v-validate="'required|email'">
          <p class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</p>
        </b-input-group>
        </div> <!-- fin de campos que piden los datos basicos del usuario -->
        <!-- password-->
        <div v-show="isVisible('password')">
        <!-- Password -->
        <b-input-group class="mb-3">
          <b-input-group-prepend>
            <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
          </b-input-group-prepend>
          <!-- Se pone logica para que la validacion solo se haga cuando el campo este visible -->
          <input v-validate="isVisible('companies')?'required|min:8': ''"  class="form-control" v-model="user.password" name="password" type="password" :placeholder="$t('message.pwd')" ref="password">
          <p class="text-danger" v-if="errors.has('password')">{{ errors.first('password') }}</p>
        </b-input-group>
        <!-- Repetir el password -->
        <b-input-group class="mb-4">
          <b-input-group-prepend>
            <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
          </b-input-group-prepend>
          <input type="password" class="form-control" name="verificarPassword" :placeholder="$t('message.repeatPwd')" v-validate="isVisible('companies')?'required|confirmed:password':''" data-vv-as="password">
          <p class="text-danger" v-if="errors.has('verificarPassword')">{{ errors.first('verificarPassword') }}</p>
        </b-input-group>
        </div>
       </form>
    </b-modal>
  </b-container>
</template>

<script>
import api from '@/services/api.js'
import i18n from '@/lang/config'
import BDData from '@/common/_BDData'
import { mapGetters } from 'vuex'
import { SET_LOADING, SET_ERROR, CLEAR_ERRORS } from '@/store/mutations.type'
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
        { key: 'profileType', label: 'Perfil', sortable: true, class: 'text-center' },
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
      modalInfo: {title: '', visible: false, mode: 'create'},
      modalChangePassword: {title: '', visible: false},
      items: [],
      user: {},
      modalErrors: [], // para mostrar los errores de creacion/edicion en el modal
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
    ...mapGetters(['companies', 'clients', 'isAdmin', 'isCompany', 'profile', 'currentUser', 'isCompany']) // Trae los getters
  },
  async created () {
    // Refresh data llama al listar  y crearObj crea un objeto listo para ser configurado
    this.refreshData()
    this.user = this.clearObj()
  },
  mounted: function () {
    this.$store.commit(CLEAR_ERRORS)
  },
  methods: {
    isVisible (fieldId) {
      // Controla visualizacion y renderizado de las validaciones
      if (fieldId === 'companies' && this.isAdmin && this.user.profileType > 1) {
        return true // Además de las condicioens basicas, si el usuario que se esta creando es administrador no se pregunta la compañía ni el cliente
      }
      if (fieldId === 'cliente' && (this.isAdmin || this.isClient) && this.user.profileType > 2) {
        return true // Además de las condicioens basicas, si el usuario que se esta creando es compania o administrador no se pregunta la compañía ni el cliente
      }
      if (fieldId === 'profileType' && (this.isAdmin)) { // Solo los admin pueden escoger el perfil
        return true
      }
      if (fieldId === 'password' && (this.modalInfo.mode === 'create' || this.modalInfo.mode === 'changePassword')) {
        // No se muestra en edicion de usuarios
        return true
      }
      return false
    },
    profileName (profileType) {
      switch (profileType) {
        case 1: return i18n.tc('message.administrador')
        case 2: return i18n.tc('message.compania')
        case 3: return i18n.tc('message.cliente')
      }
    },
    async process (item, index, button) {
      // Metodo que se llama en caso de crear o editar desde los botones de la tabla
      var idCompanyToConsult = null
      if (button.id === 'edit') {
        // Se le pone la información a los campos del modal con un metodo para copiar
        // los objetos de manera que no se vayan a cambian si el usuario cancela
        this.user = JSON.parse(JSON.stringify(item))
        this.modalInfo.title = i18n.tc('message.edit')
        this.modalInfo.mode = 'edit'
        // La compañía es la del usuario a editar
        idCompanyToConsult = this.user.company_id
      } else if (button.id === 'create') {
        this.user = this.clearObj()
        this.modalInfo.mode = 'create'
        this.modalInfo.title = i18n.tc('message.create')
        // La compañia es la del usuario autenticado cuando se esta haciendo crear
        idCompanyToConsult = this.currentUser.company_id
      } else if (button.id === 'changePassword') {
        // Se carga el usuario
        this.user = JSON.parse(JSON.stringify(item))
        // Se pone en el titulo el nombre del cliente para el que se quiere configuraar
        this.modalInfo.mode = 'changePassword'
        this.modalInfo.title = i18n.tc('message.change_password')
        // Se pasan los datos a la configuracion
        this.$root.$emit('bv::show::modal', 'modalChangePassword')
      }
      // Is admin viene de los getters del store
      if (this.isAdmin) {
        try {
          // Se trae la lista de compañías del store
          await this.$store.dispatch(FETCH_COMPANIES)
        } catch (exception) {
          this.modalErrors.push(exception.message)
        }
      } else if (this.isCompany) { // El perfil autenticado es el de una compania
        this.consultClients(idCompanyToConsult)
      }
      // Abre el modal modalInfo es el id del modal
      this.modalInfo.visible = true
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    async consultClients (idCompany) {
      try {
        this.$store.commit(SET_LOADING, true)
        let dataConsult = {}
        dataConsult.idCompany = idCompany
        dataConsult.isAdmin = this.isAdmin // tomado del store
        dataConsult.isCompany = this.isCompany // tomado del store
        var response = await api.post(dataConsult, BDData.endPoints.urlClients)
        // Estuvo exitosa la busqueda
        this.clients_by_company = response.data
        this.modalErrors = [] // Se limpian los errores del modal en caso de que existan
        this.$store.commit(SET_LOADING, false)
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
      var user = {id: null, email: null, company: null, company_id: null, client_id: null, password: null, profileType: null}
      // Los usuarios que crea un nueva compañia son iguales a la compañia que los esta creando
      if (this.isCompany) {
        user.company = this.currentUser.company
        user.company_id = this.currentUser.company_id
        // La compañia solo puede crear clients
        user.profileType = CLIENT
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
        let dataConsult = {}
        if (this.isAdmin) {
          // Para que traiga los usuarios de todas las compañías
          dataConsult.idCompany = null
        } else if (this.isCompany) {
          // Se parametrizan la info para que se consulten los datos solo de la compania del usuario autenticado
          dataConsult.idCompany = this.currentUser.company_id
        }
        dataConsult.isAdmin = this.isAdmin // tomado del store
        dataConsult.isCompany = this.isCompany // tomado del store
        var response = await api.post(dataConsult, BDData.endPoints.usersByCompany)
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
          // FIXME arreglar para que el pwd pueda quedar incompleto
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
        this.modalInfo.visible = true // FIXME por ahora obligo a que este visible el modal info pero puede q no
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
