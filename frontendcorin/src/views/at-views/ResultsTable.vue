<template>
  <b-card class="card-body">
    <div class="h5 text-info mb-3 pt-3 text-center text-uppercase font-weight-bold font-md">{{caption}}</div>
    <hr>
    <b-table :hover='hover' :bordered='bordered' :small='small'  responsive='sm' :items='items' :fields='fields' :current-page='currentPage' :per-page='perPage'>
    <template slot='average' slot-scope='data'>
      <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item.average"></vue-numeric></strong>
      <b-progress height={} class="progress-xs my-0" variant="info" :value= "data.item.average" max="9"/>
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
      perPage: 7,
      totalRows: 0
    }
  },
  created: { },
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
