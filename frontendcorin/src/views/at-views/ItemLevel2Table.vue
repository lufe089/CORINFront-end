<template>
<div class="animated fadeIn">
  <b-card class="card-body">
    <!--Iterate over the different categories -->
    <div class="loading">Loading&#8230;</div>
    <b-form @submit="onSubmit">
      <div v-for="categoryAndItems in responsesByCategoriesList" :key="categoryAndItems.id">
      <!-- stacked -->
      <b-table :hover='hover' :bordered='bordered' :small='small'  responsive='sm' :items='categoryAndItems.responsesByCategory' :fields='fields' :current-page='currentPage' :per-page='perPage' caption-top>
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
        <div class="h5 text-primary mb-0 mt-2 text-uppercase">{{categoryAndItems.category.name}}  <small> {{categoryAndItems.responsesCount}}/{{categoryAndItems.responsesByCategory.length}} </small> </div>
        <!-- Progreso por categoria -->
        <div class="float"><b-badge variant="dark" v-if="categoryAndItems.allFilled" pill>{{$t('message.all_fill')}}</b-badge></div>
        <div class="float"><b-progress :value="categoryAndItems.progressReponses" variant="info" striped class="mb-2"></b-progress></div>
        </template>
        <template slot='item_order' slot-scope='data'>
          <!--Esta es la ruta para llegar data.item es un arreglo, item es el primer elemento item luego es un campo dentro del elemento-->
          <small>{{data.item.item.item.item_order}}</small>
        </template>
        <template slot='category' slot-scope='data'>
          {{data.item.item.item.category.name}}
        </template>
        <template slot='name' slot-scope='data' class="w-20">
          <div fluid class="mx-auto">
            {{data.item.item.name}}
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
          <b-form-radio-group required :name="'likertScale'+data.item.itemId.toString()" :id="'likertScale'+data.item.itemId.toString()" v-model="data.item.numericAnswer"  v-on:change="addProgress(data.item)" :state="false">
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
              <b-form-radio :value='value.value'>
                <small>{{value.text}}</small>
              </b-form-radio>
            </div>
          </b-form-radio-group>
        </div>
        </template>
        <template slot='lowerAnchor' slot-scope='data'>
          <small>{{$t('message.total_desacuerdo') }}</small>
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
    <b-row>
      <b-col md="12">
      <div slot="footer" class="float-right">
        <b-button type="submit" size="m" variant="primary" >
          <i class="fa fa-dot-circle-o"></i> {{ $t("message.save") }}
        </b-button>
      </div>
      </b-col>
    </b-row>
    </b-form>
  </b-card>
</div>
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
        {key: 'responseFormat', label: 'Total desacuerdo (1) -- Total acuerdo (9)', class: 'scaleWidth'}
        // {key: 'upperAnchor', label: ''}
      ],
      currentPage: 1,
      perPage: 17,
      totalRows: 0,
      totalItems: 0,
      dataLevelTwo: [],
      urlGetItems: 'http://localhost:8000/' + 'activeItemsSpanish/',
      urlGetCategories: 'http://localhost:8000/simpleActiveCategories/',
      categories: [],
      responsesByCategoriesList: [],
      isLoading: true, // Control when the web services were alredy consumed
      company: {company_contact_name: 'Prueba', company_email: 'luisaEmailTest'}
    }
  },
  created: function () {
    this.loadEmptySurvey()
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
      response.state = true
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
    loadEmptySurvey () {
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
          itemResponse.numericAnswer = 2
          itemResponse.isFilled = false
          responsesSubItemsByCategory.push(itemResponse)
          this.responsesList.push(itemResponse)
        }
        //  We iterate this list in template to present the data of each category
        this.responsesByCategoriesList.push({'category': itemLevel2.category, 'responsesByCategory': responsesSubItemsByCategory, 'itemsByCategory': itemsByCategory, 'progressReponses': progress, 'responsesCount': 0, 'allFilled': false})
      }
    },
    calculateProgressByCategories () {
      for (var i = 0; i < this.responsesByCategoriesList.length; i++) {
        var responses = this.responsesByCategoriesList[i].responsesByCategory
        var totalPotentialResponses = responses.length
        this.responsesByCategoriesList[i].responsesCount = responses.filter(response => response.isFilled).length
        var progressByCategory = this.responsesByCategoriesList[i].responsesCount / totalPotentialResponses
        progressByCategory = progressByCategory * 100
        this.responsesByCategoriesList[i].progressReponses = progressByCategory
        if (this.responsesByCategoriesList[i].responsesCount === totalPotentialResponses) {
          this.responsesByCategoriesList[i].allFilled = true
        }
      }
    },
    saveResponses () {
      console.error('Guardando')
      // Send a POST request
      /* axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/participantsResponse/',
        data: {
          data: this.$parent.participantResponse
        }
      }).then(response => {
        alert('Contesto', response)
      }, error => {
        console.error(error)
      }
      ) */
      // axios.post('http://127.0.0.1:8000/participantsResponse/', this.$parent.participantResponse)

      /* axios.post('http://127.0.0.1:8000/company/', this.company).then(response => {
        alert('Contesto', response)
      }).catch(function (error) {
        console.log(error)
      }) */

      console.log('Que se va a enviar')
      console.log(JSON.stringify(this.$parent.participantResponse))
      axios.post('http://127.0.0.1:8000/participantsResponse/', this.$parent.participantResponse).then(response => {
        alert('Guarde datos', response)
      }).catch(function (error) {
        console.log(error)
      })
    },
    onSubmit (evt) {
      // the page doesn’t reload when the form is submitted,
      evt.preventDefault()

      // Asocia las respuestas obtenidas a la respuesta del participante
      this.$parent.participantResponse.subItems = this.responsesList
      this.saveResponses()
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
<style>
.table th, .table td {
    vertical-align: middle;
}
.table thead th {
    vertical-align: middle;
    border-bottom: 2px solid #a4b7c1;
    text-align: center
}
.table table td {
  text-align: center
}
.scaleWidth {
  width: 60%;
  /* text-align: center  */
}

.loading {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
