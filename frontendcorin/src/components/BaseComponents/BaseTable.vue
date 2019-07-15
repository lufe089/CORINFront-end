<template>
  <b-card class="card-body">
    <div class="h5 text-info mb-3 pt-3 text-center text-uppercase font-weight-bold font-md" v-show="caption !==''">
      {{caption}}
      <hr>
    </div>
    <b-card v-show="filterValues">
    <b-row >
      <b-col md="12" sm="12" class="my-1">
          <b-form-group :label="$t('message.filtro')" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" :placeholder="$t('message.type_to_search')" />
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''">{{$t('message.clear')}}</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="12" sm="12" class="my-1">
          <b-form-group :label="$t('message.peer_page')" class="mb-0" v-show="totalRows>=perPage">
            <b-form-select :options="pageOptions" v-model="perPage" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
    <div class="h5 text-warning mb-0 mt-2">{{$t('message.categorias')}}</div>
    <b-table :hover='hover' :bordered='bordered' :small='small'  responsive stacked='sm' :items='items' :fields='getColumns()' :current-page='currentPage' :per-page="perPage"
        :filter="filter" @filtered="onFiltered">
    <template slot='average' slot-scope='data'>
      <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item.average"></vue-numeric></strong>
      <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults(data.item.average)"  :value= "data.item.average" :max="max"/>
    </template>
    <!-- Detalles para la tabla que muestra los resultados anidados -->
    <template slot="show_details" slot-scope="row">
      <b-button size="sm" @click="row.toggleDetails" class="mr-2">
        {{ row.detailsShowing ? $t('message.hide') : $t('message.show') }}
      </b-button>
    </template>
    <template slot="row-details" slot-scope="row">
      <!-- Slot de nivel 2 para dimensiones -->
      <b-card>
        <div class="h5 text-primary mb-0 mt-2">{{$t('message.dimensions')}}</div>
        <b-table :hover='hover' :small='small'  responsive stacked='sm' :items='row.item.items' :fields='getColumns()'>
          <template slot="show_details" slot-scope="row">
            {{row.item.items.length}}
            <b-button size="md" @click="row.toggleDetails" class="mr-2" variant="primary">
              <i :class="row.detailsShowing ? 'icon-arrow-up font-xl float-left':'icon-plus font-xl float-left'"></i>
            </b-button>
          </template>
           <template slot='average' slot-scope='data'>
              <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item.average"></vue-numeric></strong>
              <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults(data.item.average)"  :value= "data.item.average" :max="max"/>
            </template>
          <!-- Slot nivel 3 para componentes -->
          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-row>
                <b-col md="6">
                  <div class="h5 text-success mb-0 mt-2">{{$t('message.components')}} de la {{$t('message.dimension')}} {{row.item.name}}</div>
                </b-col>
                <!--
                <b-col>
                  <div class="h5 text-success mb-0 mt-2">{{$t('message.dimension')}} : {{row.item.name}}</div>
                </b-col>
                <b-col md="4">
                  <div class="h5 text-success mb-0 mt-2">{{$t('message.average')}}: {{row.item.average}}</div>
                </b-col> -->
              </b-row>
              <!-- Se envia 1 en getColumns para que solo dibuje el nombre del campo y el promedio -->
              <b-table :hover='hover' borderless=true small=true responsive stacked='sm' :items='row.item.items' :fields='getColumns(1)'>
                <template slot='average' slot-scope='data'>
                  <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item.average"></vue-numeric></strong>
                  <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults(data.item.average)"  :value= "data.item.average" :max="max"/>
                </template>
              </b-table>
            </b-card>
          </template>
        </b-table>
      </b-card>
    </template>
    </b-table>
    <nav>
      <b-pagination v-show="totalRows>=perPage" :total-rows='getRowCount(items)' :per-page='perPage' v-model='currentPage' prev-text='Prev' next-text='Next' hide-goto-end-buttons/>
    </nav>
  </b-card>
</template>

<script>

export default {
  name: 'base-table',
  props: {
    caption: {
      type: String,
      default: ' '
    },
    hover: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    filterValues: {
      type: Boolean,
      default: false
    },
    columnsDetail: {
      type: Number, // Controla si se deben poner datos diferentes en las columnas de la tabla para reutilizar el componente
      default: 1
    }
  },
  data: () => {
    return {
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [ 5, 10, 15, 40 ],
      filter: null,
      max: 9
    }
  },
  methods: {
    getBadge (status) {
      return status === 'Active' ? 'success'
        : status === 'Inactive' ? 'secondary'
          : status === 'Pending' ? 'warning'
            : status === 'Banned' ? 'danger' : 'primary'
    },
    getRowCount (items) {
      return items.length
    },
    calculateProgress (average) {
      return (average * 100) / 9
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    calculateVariantResults: function (number) {
      var variant = ''
      if (number >= 7) {
        variant = 'success'
      } else if (number <= 3) {
        variant = 'danger'
      } else {
        variant = 'warning'
      }
      return variant
    },
    getColumns: function (value = null) {
      // NO se envia valor
      if (value === null) {
        value = this.columnsDetail
      }
      var fields = []
      if (value === 1 || value === 3) {
        fields = [ {key: 'name', label: 'Nombre', sortable: true, class: 'widthColumn'},
          {key: 'average', label: 'Promedio', sortable: true}]
      } else if (value === 2) {
        fields = [ {key: 'name', label: 'Nombre', sortable: true, class: 'widthColumn'},
          {key: 'category', label: 'Categoría', sortable: true},
          {key: 'average', label: 'Promedio', sortable: true}]
      }
      if (value === 3) { // Tabla anidada en la que se pueden ver los detalles que constituyen los promedios
        fields.push({key: 'show_details', label: 'Detalles', sortable: false})
      }
      return fields
    }
  },
  components: {
  }
}
</script>
<style>
.widthColumn {
  width: 60%;
  /* text-align: center  */
}
</style>
