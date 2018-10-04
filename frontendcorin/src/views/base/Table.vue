<template>
  <b-card :header='caption' class="card-body">
    <b-table :hover='hover' :bordered='bordered' :small='small'  responsive='sm' :items='items' :fields='fields' :current-page='currentPage' :per-page='perPage'>
      <template slot='description' slot-scope='row'>
        <div class='clearfix'>
          <div class='float-left'>
            <!-- Row is the slow scope therefore is the way to access to the information that we are drawing -->
            {{row.item.description}}
          </div>
          <div class='float-right'>
             <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
             <!-- https://bootstrap-vue.js.org/docs/components/table/#row-details-support -->
            <b-btn class='badge badge-pill badge-dark'  @click.stop='row.toggleDetails' v-model='row.detailsShowing'>
              {{row.detailsShowing ? $t('message.hide') : $t('message.why_question')}}
            </b-btn>
          </div>
        </div>
      </template>
      <template slot='responseFormat' slot-scope='data'>
      <div>
         <!-- other whay to use the radio button group
           <b-form-group :id=''likertScale'+data.item.itemId'>
          <b-form-radio-group v-model='selected' :options='options' name='likertScale'>
          </b-form-radio-group>
        </b-form-group> -->
        <b-form-radio-group   :name="'likertScale'+data.item.itemId" :id="'likertScale'+data.item.itemId" v-model="responsesList[data.item.itemId].numericAnswer">
          <div v-for='(value, key) in options' :key='key' class='custom-control-inline col-sm-4 py-0'>
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
      <!-- Checkbox needReview -->
      <template slot='needReview' slot-scope='row'>
         <div class='clearfix'>
          <div class='float-left'>
            <b-form-checkbox @click.native.stop @change='toggleReview(responsesList[row.item.itemId])' v-model='responsesList[row.item.itemId].needReview'>
                {{$t('message.needs_review')}}
            </b-form-checkbox>
            <div class='form-group' v-show='responsesList[row.item.itemId].needReview'>
              <b-form-select v-model='responsesList[row.item.itemId].typeReview' :options='improvementOptions' class='mb-1'/>
              <b-form-group>
                  <small>{{$t('message.please_explain')}}</small>
                  <b-form-textarea id='commentsText' :rows='2' v-model='responsesList[row.item.itemId].reviewComments'></b-form-textarea>
                </b-form-group>
            </div>
          </div>
         </div>
      </template>
      <!-- Details of the review that the item migth need.  This slot should be named as row-details to work properly-->
      <template slot='row-details' slot-scope='row'>
        <item-justification :justification='row.item.justification' :itemName='row.item.name'></item-justification>
      </template>
    </b-table>
    <nav>
      <b-pagination :total-rows='getRowCount(items)' :per-page='perPage' v-model='currentPage' prev-text='Prev' next-text='Next' hide-goto-end-buttons/>
    </nav>
  </b-card>
</template>

<script>

// import BDData from '../at-views/_BDData.js'
// import itemJustification from '../at-views/ItemJustification.vue'

export default {
  name: 'c-table',
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
    }
  },
  data: () => {
    return {
      responsesList: [],
      fields: [
        {key: 'itemId', label: 'Id', sortable: true},
        {key: 'name', sortable: true},
        {key: 'description'},
        {key: 'needReview', label: 'SIIIIIIIIIIIIIIIIIIIII Needs review será?'},
        {key: 'responseFormat', label: 'Response'}
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Just a litte', value: 1 },
        { text: 'Somewhat', value: 2 },
        { text: 'Mostly', value: 3 },
        { text: 'Almost totally', value: 4 },
        { text: 'Totally', value: 5 },
        { text: 'Don\'t know', value: 0 },
        { text: 'N/A', value: -1 }
      ]
    }
  },
  created () {
    /* Creates a list of objects that will save user answers */
    var testResponseList = []
    for (var i = 0; i < this.items.length; i++) {
      var itemResponse = {}
      var itemId = this.items[i].itemId
      itemResponse.itemId = itemId
      itemResponse.needReview = false
      itemResponse.numericAnswer = null
      itemResponse.typeResponse = null
      itemResponse.reviewComments = null
      itemResponse.typeReview = null
      itemResponse.idResponseFormat = null
      testResponseList.push(itemResponse)
    }
    this.responsesList = {
      'subc1': testResponseList[0],
      'subc2': testResponseList[1],
      'subc3': testResponseList[2]
    }
    console.log('propertyComputed will update, as this.property is now reactive.')
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
    toggleJustification (item) {
      /* Chages the justification of an item from visible to visible and vice-versa */
      item.showJustification = !item.showJustification
    },
    toggleReview (row) {
      /* Chages the justification of an item from visible to visible and vice-versa */
      row.needReview = !row.needReview
    }
  },
  components: {
    /* tag, component name */
    // 'item-justification': itemJustification
  }
}
</script>
