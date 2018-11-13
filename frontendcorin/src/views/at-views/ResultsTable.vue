<template>
  <b-card class="card-body">
    <div class="h5 text-info mb-3 pt-3 text-center text-uppercase font-weight-bold font-md">{{caption}}</div>
    <hr>
    <b-card>
    <b-row>
      <b-col md="8" sm="12" class="my-1">
          <b-form-group :label="$t('message.filtro')" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" :placeholder="$t('message.type_to_search')" />
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''">{{$t('message.clear')}}</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12" class="my-1">
          <b-form-group :label="$t('message.peer_page')" class="mb-0" v-show="totalRows>=perPage">
            <b-form-select :options="pageOptions" v-model="perPage" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
    <b-table :hover='hover' :bordered='bordered' :small='small'  responsive='sm' :items='items' :fields='fields' :current-page='currentPage' :per-page="perPage"
        :filter="filter" @filtered="onFiltered">
    <template slot='average' slot-scope='data'>
      <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item.average"></vue-numeric></strong>
      <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults(data.item.average)"  :value= "data.item.average" :max="max"/>
    </template>
    </b-table>
    <nav>
      <b-pagination :total-rows='getRowCount(items)' :per-page='perPage' v-model='currentPage' prev-text='Prev' next-text='Next' hide-goto-end-buttons/>
    </nav>
  </b-card>
</template>

<script>

export default {
  name: 'c-table-results',
  props: {
    caption: {
      type: String,
      default: 'Table'
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
    }
  },
  data: () => {
    return {
      fields: [
        {key: 'name', label: 'Nombre', sortable: true, class: 'widthColumn'},
        {key: 'average', label: 'Promedio', sortable: true}
        /* {key: 'email', label: 'Email', sortable: true, class: 'widthColumn'},
        {key: 'comments', label: 'Comentarios', sortable: true},
        {key: 'area', label: 'Area', sortable: true},
        {key: 'is_directive', label: 'Es directivo?', sortable: true},
        {key: 'posicion', label: 'Es directivo?', sortable: true},
        {key: 'promedio', sortable: true} */ ],
      currentPage: 1,
      perPage: 15,
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
