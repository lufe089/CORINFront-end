<template>
  <b-card :header='caption' class="card-body">
    <div v-for="categoryItems in responsesByCategoriesMap" :key="categoryItems">
      <!-- stacked -->
      <b-table :hover='hover' :bordered='bordered' :small='small'  responsive='sm' :items='categoryItems.responsesByCategory' :fields='fields' :current-page='currentPage' :per-page='perPage' caption-top>
        <template slot="table-caption">
        <!-- Progress section -->
        <div class='float-right'>
          <small>{{$t('message.general_progress')}}</small>
          <i class="fa fa-battery-2"></i>
          <!-- <span class="title">{{$t('message.progress')}}</span> -->
          <span class="value">{{completed}}/ {{totalItems}} <span class="text-muted small">{{progress}}%</span></span>
          <div class="bars">
            <b-progress class="progress-xs" :value="progressBar" variant="info" ></b-progress>
          </div>
        </div>
        <!-- Group level name -->
        <div class="h5 text-primary mb-0 mt-2 text-uppercase">{{categoryItems.category.name}}  <small> {{categoryItems.responsesCount}}/{{categoryItems.responsesByCategory.length}} </small> </div>
        <!-- Progreso por categoria -->
        <div>
          <b-progress :value="categoryItems.progressReponses" variant="info" striped :animated="animate" class="mb-2"></b-progress>
        </div>
        </template>
        <template slot='item_order' slot-scope='data'>
          <!--Esta es la ruta para llegar data.item es un arreglo, item es el primer elemento item luego es un campo dentro del elemento-->
          <small>{{data.item.item.item.item_order}}</small>
        </template>
        <template slot='category' slot-scope='data'>
          {{data.item.item.item.category.name}}
        </template>
        <template slot='lowerAnchor' slot-scope='data'>
          <small>{{$t('message.total_desacuerdo') }}</small>
        </template>
        <template slot='name' slot-scope='data'>
          <div fluid>
             <b-row>
              <b-col md="12">
               {{data.item.item.name}}
              </b-col>
             </b-row>
             <!--<b-row>
              <b-col md="2">
                <small>{{$t('message.total_desacuerdo') }}</small>
              </b-col>
              <b-col md="8">
                <b-form-radio-group :name="'likertScale'+data.item.itemId.toString()" :id="'likertScale'+data.item.itemId.toString()" v-model="data.item.numericAnswer"  v-on:change="addProgress(data.item)">
                <div v-for='(value, key) in appliesLikertOptions' :key='key' class='custom-control-inline col-md-1 py-0'>
                  <div class="w-15" style="height=100%">
                    <div class="h-70">
                      <small>{{value.value === 5 || value.value === -1 || value.value === -2  || value.value === 0 ? value.text: '--------------'}}</small>
                    </div>
                    <div class="h-30">
                      <b-form-radio :value='value.value' :id='data.item.itemId+value.value'/>
                    </div>
                  </div>
                </div> -->
                <!-- For debuggin purposes
                <small>name likertScale {{data.item.itemId.toString()}}</small>
                <small>save in {{data.item.itemId +' answer: ' +data.item.numericAnswer }}{{data.item}}</small>-->
                <!--<div v-for='(value, key) in appliesLikertOptions' :key='key' class='custom-control-inline py-0'>
                  <b-form-radio :value='value.value'  >
                    <small>{{value.text}}</small>
                  </b-form-radio>
                </div>
                </b-form-radio-group>
              </b-col>
              <b-col md="2">
                <div class='float-left'>
                  <small>{{$t('message.total_acuerdo') }}</small>
                </div>
              </b-col>
             </b-row>-->
          </div>
        </template>
        <!-- Likert scale -->
        <template slot='responseFormat' slot-scope='data'>
        <div>
          <!-- other whay to use the radio button group
            <b-form-group :id=''likertScale'+data.item.itemId'>
            <b-form-radio-group v-model='selected' :options='options' name='likertScale'>
            </b-form-radio-group>
          </b-form-group> -->
          <!-- <small>Not at all</small> -->
          <b-form-radio-group required :name="'likertScale'+data.item.itemId.toString()" :id="'likertScale'+data.item.itemId.toString()" v-model="data.item.numericAnswer"  v-on:change="addProgress(data.item)">
            <!--<div v-for='(value, key) in appliesLikertOptions' :key='key' class='custom-control-inline col-md-1 py-0'>
              <div class="w-15" style="height=100%">
                <div class="h-70">
                  <small>{{value.value === 5 || value.value === -1 || value.value === -2  || value.value === 0 ? value.text: '--------------'}}</small>
                </div>
                <div class="h-30">
                  <b-form-radio :value='value.value' :id='data.item.itemId+value.value'/>
                </div>
              </div>
            </div> -->
            <!-- For debuggin purposes
            <small>name likertScale {{data.item.itemId.toString()}}</small>
            <small>save in {{data.item.itemId +' answer: ' +data.item.numericAnswer }}{{data.item}}</small>-->
            <div v-for='(value, key) in appliesLikertOptions' :key='key' class='custom-control-inline py-0'>
              <b-form-radio :value='value.value'  >
                <small>{{value.text}}</small>
              </b-form-radio>
            </div>
          </b-form-radio-group>
        </div>
        </template>
        <template slot='upperAnchor' slot-scope='data'>
          <small>{{$t('message.total_acuerdo') }}</small>
        </template>
        <!-- Details of the justification  This slot should be named as row-details to work properly-->
        <!--<template slot='row-details' slot-scope='row'>
          <item-justification :justification='row.item.justification' :itemName='row.item.name'></item-justification>
        </template>-->
      </b-table>
      <nav>
      <!--<b-pagination :total-rows='getRowCount(responsesList)' :per-page='perPage' v-model='currentPage' prev-text='Prev' next-text='Next' hide-goto-end-buttons/>-->
      </nav>
    </div>
  </b-card>
</template>

<script>

import BDData from './_BDData.js'
import itemJustification from './ItemJustification.vue'
import axios from 'axios'
import i18n from '../../lang/config'
// import func from './vue-temp/vue-editor-bridge.js'

export default {
  name: 'item-level2-table',
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
    improvementOptions: {
      type: Array,
      default: function () { return BDData.improvementOptions }
    },
    appliesLikertOptions: {
      type: Array,
      default: function () { return BDData.appliesLikertOptions }
    }
  },
  data: () => {
    return {
      responsesList: [],
      // items: BDData.customizedInstrument.itemsHierarchy.motivationHierarchy.hierarchicalItem.subHierarchicalItems.subItems
      fields: [
        // {key: 'item_order', sortable: true, label: '#'},
        {key: 'name', sortable: true, label: 'Item'},
        // {key: 'category', sortable: true, label: 'Categoria'},
        // {key: 'lowerAnchor', label: ''},
        {key: 'responseFormat', label: 'Total desacuerdo (1) -- Total acuerdo (9)'}
        // {key: 'upperAnchor', label: ''}
      ],
      currentPage: 1,
      perPage: 17,
      totalRows: 0,
      totalItems: 0,
      dataLevelTwo: [],
      urlHost: 'http://localhost:8000/',
      urlGetItems: 'http://localhost:8000/' + 'activeItemsSpanish/',
      urlGetCategories: 'http://localhost:8000/simpleActiveCategories/',
      categories: [],
      responsesByCategoriesMap: [],
      isLoading: true // Control when the web services were alredy consumed
    }
  },
  created: function () {
    /* Consume los servicios que se exponen en el servidor de django */
    axios.get(this.urlGetItems).then(response => {
      var subItems = response.data
      axios.get(this.urlGetCategories).then(response => {
        var categories = response.data
        this.prepareData(categories, subItems)
        // TODO hace aqui un arreglo pq si ya existe solo hay que cargar los datos
        this.prepareItemResponses()
        // Solo para control alert(JSON.stringify(this.dataLevelTwo))
      }, error => {
        console.error(error)
        console.error(i18n.tc('message.error_consuming_service_detail_categories'))
        console.error('Service path:' + this.urlGetCategories)
        alert(i18n.tc('message.error_consuming_service'))
        this.isLoading = false
      })
    }, error => {
      console.error(error)
      console.error(i18n.tc('message.error_consuming_service_detail_items'))
      console.error('Service path:' + this.urlGetItems)
      alert(i18n.tc('message.error_consuming_service'))
      this.isLoading = false
    })
  },
  methods: {
    getRowCount (items) {
      return items.length
    },
    toggleJustification () {
      /* Chages the justification of an item from visible to visible and vice-versa */
      this.showLevel2Justification = !this.showLevel2Justification
    },
    toggleReview (row) {
      /* Chages the justification of an item from visible to visible and vice-versa */
      row.needReview = !row.needReview
    },
    addProgress (response) {
      /* Event called when a likert option is selected */
      response.isFilled = true
      this.calculateProgressByCategories()
    },
    clearLikertScale (response) {
      /* This condition is hired with false because the onchage event is render before the actual value of the control is changed
      then the event is hired before the checkbox has the true value that means the N_A field was selected  */
      if (response.N_A === false) {
        // We disable the items selected in case the N/A option was selected
        response.numericAnswer = null
        response.isFilled = true
      } else {
        // Si ya se deselecciona la escala de likert entonces se asume que el campo no ha sido lleno
        response.isFilled = false
      }
    },
    prepareData: function (categories, items) {
      // Organiza los items agrupandolos por categoria
      for (var i = 0; i < categories.length; i++) {
        var level2 = {}
        level2.category = categories[i]
        level2.subItems = items.filter(result => result.item.category.id === categories[i].id)
        this.dataLevelTwo.push(level2)
      }

      this.isLoading = false
    },
    prepareItemResponses () { // Crea los objetos de tipo respuesta que son los que se almacena luego en la bd
      /* Creates a list of objects that will save user answers */
      for (var t = 0; t < this.dataLevelTwo.length; t++) {
        this.totalItems += this.dataLevelTwo[t].subItems.length
        var itemLevel2 = this.dataLevelTwo[t]
        // Por cada elemento de nivel 2 se recorren su subitems
        var responsesSubItemsByCategory = []
        var itemsByCategory = 0
        var progress = 0.0
        for (var i = 0; i < itemLevel2.subItems.length; i++) {
          var itemResponse = {}
          var itemId = itemLevel2.subItems[i].id
          itemResponse.name = itemLevel2.subItems[i].name
          itemResponse.itemId = itemId
          itemResponse.item = itemLevel2.subItems[i]
          itemResponse.numericAnswer = null
          /* itemResponse.typeResponse = null
          itemResponse.reviewComments = null
          itemResponse.typeReview = null
          itemResponse.idResponseFormat = null
          itemResponse.N_A = false */
          // Control if an item was filled or not
          itemResponse.isFilled = false
          responsesSubItemsByCategory.push(itemResponse)
          this.responsesList.push(itemResponse)
        }
        this.responsesByCategoriesMap.push({'category': itemLevel2.category, 'responsesByCategory': responsesSubItemsByCategory, 'itemsByCategory': itemsByCategory, 'progressReponses': progress, 'responsesCount': 0})
      }
    },
    calculateProgressByCategories () {
      for (var i = 0; i < this.responsesByCategoriesMap.length; i++) {
        var responses = this.responsesByCategoriesMap[i].responsesByCategory
        var totalPotentialResponses = responses.length
        this.responsesByCategoriesMap[i].responsesCount = responses.filter(response => response.isFilled).length
        var progressByCategory = this.responsesByCategoriesMap[i].responsesCount / totalPotentialResponses
        progressByCategory = progressByCategory * 100
        this.responsesByCategoriesMap[i].progressReponses = progressByCategory
      }
    }

  },
  components: {
    /* tag, component name */
    'item-justification': itemJustification
  },
  computed: {
    // Computed functions are called only when change the values of their related properties
    completed: function () {
      /* In this method we identify how many subitems have been selected */
      return this.responsesList.filter(response => response.isFilled).length
      // return selectedItems
    },
    progress: function () {
      var number = (this.completed / this.totalItems) * 100
      // Round the number to show only two decimals
      number = number.toFixed(2)
      return number
    },
    progressBar: function () {
      return Number(this.progress)
    }
  }
}
</script>
