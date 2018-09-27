<template>
  <b-card :header='caption' class="card-body">
    <!-- stacked -->
    <b-table :hover='hover' :bordered='bordered' :small='small'  responsive='md' :dataHierarchicalLevelTwo='dataHierarchicalLevelTwo' :items='responsesList' :fields='fields' :current-page='currentPage' :per-page='perPage' caption-top>
      <template slot="table-caption">
      <b-card :no-body="true">
        <b-card-body class="p-3 clearfix">
          <!-- Progress section -->
          <div class='float-right'>
          <i class="fa fa-battery-2"></i>
          <!-- <span class="title">{{$t('message.progress')}}</span> -->
          <span class="value">{{completed}}/ {{totalItems}} <span class="text-muted small">{{progress}}%</span></span>
          <div class="bars">
            <b-progress class="progress-xs" :value="progressBar" variant="info" ></b-progress>
          </div>
         </div>
          <!--
          <div class="h1 text-muted text-left mb-4">
            <i class="fa fa-puzzle-piece fa-circle bg-primary p-4 px-5 font-2xl mr-3 float-left round" id='justification_item'></i>
          </div>-->
          <div class="h5 text-primary mb-0 mt-2 text-uppercase">{{dataHierarchicalLevelTwo.name}}</div>
          <div class='clearfix'>
            <div class='float-left text-muted font-weight-bold font-xs'>
             {{dataHierarchicalLevelTwo.description}}
            </div>
            <div class='float-right'>
              <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
              <!-- https://bootstrap-vue.js.org/docs/components/table/#row-details-support -->
              <b-btn class='badge badge-pill badge-dark' v-on:click="toggleJustification">
               {{showLevel2Justification ? $t('message.hide') : $t('message.why_question')}}
              </b-btn>
            </div>
          </div>
          <item-justification v-show='showLevel2Justification' :justification='dataHierarchicalLevelTwo.justification' :itemName='dataHierarchicalLevelTwo.name'></item-justification>
          <div class="text-muted font-weight-bold font-xs">
            <small>
             alhop-4 px-5 font-2xl mr-3
            </small>
          </div>
        </b-card-body>
      </b-card>
      </template>
      <template slot='description' slot-scope='row'>
        <div class='clearfix'>
          <div class='float-left'>
            <!-- Row is the slow scope therefore is the way to access to the information that we are drawing -->
            {{row.item.description}}
          </div>
          <div class='float-right'>
             <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
             <!-- https://bootstrap-vue.js.org/docs/components/table/#row-details-support -->
            <b-btn class='badge badge-pill badge-dark'  @click.stop='row.toggleDetails' v-model='row.item.detailsShowing'>
              {{row.item.detailsShowing ? $t('message.hide') : $t('message.why_question')}}
            </b-btn>
          </div>
        </div>
      </template>
      <!-- Checkbox needReview -->
      <template slot='needReview' slot-scope='row'>
         <div class='clearfix'>
          <div class='float-left'>
            <b-form-checkbox @click.native.stop @change='toggleReview(row.item)' v-model='row.item.needReview'/>
                <!-- se quita para no introducir ruido en la tabla
                {{$t('message.needs_review')}} -->
            <div class='form-group' v-show='row.item.needReview'>
              <b-form-select v-model='row.item.typeReview' :options='improvementOptions' class='mb-1'/>
              <b-form-group>
                  <small>{{$t('message.please_explain')}}</small>
                  <b-form-textarea id='commentsText' :rows='2' v-model='row.item.reviewComments'></b-form-textarea>
                </b-form-group>
            </div>
          </div>
         </div>
      </template>
      <!-- N/A option -->
      <template slot='N/A' slot-scope='row'>
         <b-form-checkbox v-model='row.item.N_A' :id='"na"+row.item.itemId' v-on:change="clearLikertScale(row.item)"/>
          <b-tooltip :trigger='hover' :target='"na"+row.item.itemId' placement='top'>
             {{$t('message.n_a_explanation')}}
          </b-tooltip>
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
        <b-form-radio-group :name="'likertScale'+data.item.itemId" :id="'likertScale'+data.item.itemId" v-model="data.item.numericAnswer"  v-on:change="addProgress(data.item)" :disabled="data.item.N_A">
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
          <div v-for='(value, key) in appliesLikertOptions' :key='key' class='custom-control-inline col-sm-4 py-0'>
            <b-form-radio :value='value.value' :id='data.item.itemId+value.value' >
              <small>{{value.text}}</small>
            </b-form-radio>
            <!-- <b-tooltip  :target='data.item.itemId+value.value' placement='top' v-show="value.value=-1">
                Hello <strong>World!</strong>
            </b-tooltip> -->
          </div>
        </b-form-radio-group>
      </div>
      </template>
      <!-- Details of the justification  This slot should be named as row-details to work properly-->
      <template slot='row-details' slot-scope='row'>
        <item-justification :justification='row.item.justification' :itemName='row.item.name'></item-justification>
      </template>
    </b-table>
    <nav>
      <!--<b-pagination :total-rows='getRowCount(items)' :per-page='perPage' v-model='currentPage' prev-text='Prev' next-text='Next' hide-goto-end-buttons/> -->
    </nav>
  </b-card>
</template>

<script>

import BDData from './_BDData.js'
import itemJustification from './ItemJustification.vue'
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
    },
    dataHierarchicalLevelTwo: {
      type: Object
    }
  },
  data: () => {
    return {
      responsesList: [],
      // items: BDData.customizedInstrument.itemsHierarchy.motivationHierarchy.hierarchicalItem.subHierarchicalItems.subItems
      fields: [
        {key: 'itemId', label: 'Id', sortable: true},
        {key: 'name', sortable: true},
        {key: 'description'},
        {key: 'needReview', label: 'Needs review?....'},
        {key: 'N/A', label: 'N/A?'},
        {key: 'responseFormat', label: 'Response'}
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      totalItems: 0,
      showLevel2Justification: false
    }
  },
  mounted () {
    /* Creates a list of objects that will save user answers */
    this.totalItems = this.dataHierarchicalLevelTwo.subItems.length
    for (var i = 0; i < this.totalItems; i++) {
      var itemResponse = {}
      var itemId = this.dataHierarchicalLevelTwo.subItems[i].itemId
      itemResponse.name = this.dataHierarchicalLevelTwo.subItems[i].name
      itemResponse.description = this.dataHierarchicalLevelTwo.subItems[i].description
      itemResponse.itemId = itemId
      itemResponse.needReview = false
      itemResponse.numericAnswer = null
      itemResponse.typeResponse = null
      itemResponse.reviewComments = null
      itemResponse.typeReview = null
      itemResponse.idResponseFormat = null
      itemResponse.N_A = false
      // Control if an item was filled or not
      itemResponse.isFilled = false
      this.responsesList.push(itemResponse)
    }
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
      // Round the number to show two decimals only
      number = number.toFixed(2)
      return number
    },
    progressBar: function () {
      return Number(this.progress)
    }
  }
}
</script>
