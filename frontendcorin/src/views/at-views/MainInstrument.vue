<template>
  <div class="animated fadeIn">
    <b-row fluid>
       <b-col md="12">
         <b-card>
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">Company name</h5>
              <small>type of use - framework version</small>
            </div>
            <p class="mb-1">
              Donec id elit non mi porta gravida at eget metus. Maecenas
              sed diam eget risus varius blandit.
            </p>
          </b-card>
        <b-card>
          <div slot="header">
            <b-row >
              <b-col md="12">
                  <strong>{{ $t("message.participant_form_header") }}</strong>
              </b-col>
             </b-row>
          </div>
          <!-- Bootstrap Vue has some problems with Inline forms that's why we use some standard bootstrap classes -->
          <div fluid>
            <b-row>
              <b-col md="6">
                <b-form-group :description="$t('message.please_enter_name')" :label="$t('message.name')" label-for="basicName" :label-cols="2"
                  :horizontal="true">
                  <b-form-input id="basicName" type="text" v-model.lazy="participantResponse.name"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :description="$t('message.please_enter_email')" :label="$t('message.email')" label-for="basicEmail" :label-cols="2"
                  :horizontal="true">
                  <b-form-input id="basicEmail" type="email" placeholder="lfrincon@applies.variamos.com" v-model.lazy="participantResponse.email"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-form-group
                  :label="$t('message.profile')"  label-for="basicInlineCustomCheckboxes"
                  :label-cols="1"
                  :horizontal="true">
                  <b-form-checkbox-group id="participantProfiles" v-model="participantResponse.profiles">
                    <div class="custom-control custom-checkbox custom-control-inline col-sm-3 py-1" v-for="(value, key) in parameters.profiles" :key="key">
                     <!-- <b-form-checkbox :value="value.value" class="custom-control-input" :id="'profile'+value.id"></b-form-checkbox>
                     <label class="custom-control-label" :for="'profile'+value.id">{{value.text}}</label> -->
                     <b-form-checkbox :id="'profile'+value.value" :value="value.value" >{{value.text}}</b-form-checkbox>
                    </div>
                  </b-form-checkbox-group>
                </b-form-group>
                <!-- No voy a pintar el checkbox asi pq no puedo contrar cuantas columnas ocupa
                <b-form-group label="Using <code>options</code> array:">
                  <b-form-checkbox-group id="checkboxes1" name="flavour1" v-model="participantResponse.profiles" :options="parameters.profiles">
                  </b-form-checkbox-group>
                </b-form-group>
                -->
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-form-group
                  :label="$t('message.comments')" label-for="commentsTextarea"
                  :label-cols="1"
                  :horizontal="true">
                  <textarea class="form-control rounded-0" id="exampleFormControlTextarea1" rows="3" :placeholder="$t('message.any_comment')" v-model="participantResponse.comments"></textarea>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
          <b-row>
            <b-col md="12">
            <div slot="footer" class="float-right">
              <b-button type="submit" size="m" variant="primary" v-on:click.prevent="starForm" >
                <i class="fa fa-dot-circle-o"></i> {{ $t("message.start") }}</b-button>
            </div>
            </b-col>
           </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- Formulario para llenar las dimensiones, subcriterios y criterios -->
    <b-row fluid>
      <b-col lg="12">
        <item-level2-table hover caption="<i class='fa fa-align-justify'></i> APPLIES motivation"></item-level2-table>
      </b-col><!--/.col-->
    </b-row>
  </div>
</template>
<script>

import BDData from './_BDData.js'
import itemLevel2Table from './ItemLevel2Table.vue'
// import i18n from '../../lang/config'

export default {
  name: 'main_instrument',
  data () {
    return {
      participantResponse: {},
      serviceResult: {},
      parameters: BDData.parameters,
      selected: [] // Must be an array reference!,
    }
  },
  components: {
    /* tag, component name */
    itemLevel2Table
  },
  methods: {
    click () {
      // do nothing
    },
    clone (obj) {
      var outpurArr = []
      for (var i in obj) {
        outpurArr[i] = typeof (obj[i]) === 'object' ? this.clone(obj[i]) : obj[i]
      }
      return outpurArr
    },
    starForm: function () {
      alert(JSON.stringify(BDData.participantResponse))
    }
  },
  filters: {
    decimalNumbers: function (value) {
      if (!value) return ''
      value = value.toFixed(2)
      return value
    }
  },
  created: function () {
    /* Duplicar aqui toda la informacion que pueda cambiar por cada persona que response el instrumento
    para tomar como objeto de referencia el json que esta en el archivo parametrico pero no modificarlo */
    this.participantResponse = this.clone(BDData.participantResponse)
  }
}
</script>
