<template>
  <div class="animated fadeIn">
    <!--<div v-show="isLoading">
      <img class="loading" src="https://vignette.wikia.nocookie.net/judo/images/0/03/Cargando.gif/revision/latest?cb=20110601212206&path-prefix=es" alt="loading">
    </div>-->
    <loading :isLoading="isLoading"></loading>
    <b-row fluid v-show="!errors && !isSurveyVisible && !showThanksMessage">
      <b-col md=12>
         <b-jumbotron bg-variant="light">
        <template slot="header">
          <span class="text-center" v-html="$t('message.welcome_to_applies')"></span>
          <hr class="my-4">
        </template>
        <template slot="lead">
           <b-row fluid>
             <b-col md="12">
               <b-card class="mx-auto" border-variant="info">
                <span v-html="instruccionData.custom_user_instructions"></span>
                <div slot="footer">
                  <small class="text-muted" v-html="instruccionData.custom_contact_info"></small>
                </div>
                </b-card>
             </b-col>
           </b-row>
        </template>
        <b-btn variant="primary" v-on:click.prevent="startSurvey"  class="float-right">{{$t("message.lets_start")}}</b-btn>
      </b-jumbotron>
      </b-col>
    </b-row>

    <div v-show="isSurveyVisible && !showThanksMessage && !errors">
      <b-row fluid>
        <b-col md="12">
          <!--<b-card>
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1 text-right">Company name</h5>
                <small>version</small>
              </div>
            </b-card> -->
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
              <b-form @submit="onSubmit">
                <b-row>
                  <b-col md="6">
                    <b-form-group :description="$t('message.please_enter_email')" :label="$t('message.email')" label-for="basicEmail" :label-cols="2"
                      :horizontal="true">
                      <b-form-input id="basicEmail" type="email" placeholder=" " autocomplete='email' v-model.lazy="participantResponse.email" required ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group :description="$t('message.please_enter_area')" :label="$t('message.area')" label-for="area" :label-cols="2"
                      :horizontal="true">
                      <b-form-select id="area" v-model="participantResponse.area_id" :options="areas" required/>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-group :label="$t('message.es_directivo')" label-for="positionDirective" :label-cols="6"
                      :horizontal="true">
                      <b-form-radio-group id="positionDirective" v-model="participantResponse.is_directive" :options="parameters.position" name="positionDirective" required></b-form-radio-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="12">
                    <b-form-group
                      :label="$t('message.comments')" label-for="commentsTextarea"
                      :label-cols="2"
                      :horizontal="true">
                      <textarea class="form-control rounded-0" id="exampleFormControlTextarea1" rows="3" :placeholder="$t('message.any_comment')" v-model="participantResponse.comments"></textarea>
                    </b-form-group>
                  </b-col>
                </b-row>
               <b-row>
              <b-col md="12">
              <div slot="footer" class="float-right">
                <b-button type="submit" size="m" variant="primary">
                  <i class="fa fa-dot-circle-o"></i> {{ $t("message.continue") }}</b-button>
              </div>
              </b-col>
            </b-row>
            </b-form>
            </div>
          </b-card>
        </b-col>
    </b-row>

    <!-- Formulario para llenar las dimensiones, subcriterios y criterios -->
    <b-row fluid v-show=showQuestions>
      <b-col lg="12">
        <item-level2-table hover @item-level2-table:change='processEnd'></item-level2-table>
      </b-col><!--/.col-->
    </b-row>
    </div>
    <!-- Mensaje de agradecimiento -->
    <b-row md="12">
       <b-col lg="12">
          <b-card v-show="showThanksMessage"
                header-tag="header"
                footer-tag="footer">
                <b-alert show variant="success">
                  <h4 class="alert-heading">{{ $t("message.fin_encuesta") }}</h4>
                  <hr>
                  <p>
                    <span v-html="instruccionData.custom_thanks"></span>
                  </p>
                </b-alert>
          </b-card>
       </b-col>
    </b-row>
  </div>
</template>
<script>

import BDData from './_BDData.js'
import api from './api'

export default {
  name: 'main_instrument',
  data () {
    return {
      participantResponse: null,
      serviceResult: {},
      result: '',
      isSurveyVisible: false,
      areas: {},
      parameters: BDData.parameters,
      ulrInstructions: 'consult-custom-inst/?idClient=',
      urlAreas: '/areas/',
      // FIXME
      idClient: 1,
      urlSaveSubItems: BDData.apiURL + 'participantsResponse/',
      selected: [], // Must be an array reference!,
      showDirective: undefined,
      showQuestions: false,
      instruccionData: {custom_user_instructions: '', custom_contact_info: '', custom_thanks: ' '},
      showThanksMessage: false,
      isLoading: null,
      errors: false

    }
  },
  async created () {
    /* Duplicar aqui toda la informacion que pueda cambiar por cada persona que response el instrumento
    para tomar como objeto de referencia el json que esta en el archivo parametrico pero no modificarlo */
    this.participantResponse = this.clone(BDData.participantResponse)
    // Refresh data llama al listar  y crearObj crea un objeto listo para ser configurado
    this.refreshData()
  },
  components: {
    /* tag, component name */
    // itemLevel2Table()
    // dynamic import wrapped in a function
    // 'item-level2-table': () => import('./ItemLevel2Table')
    itemLevel2Table: () => import('./ItemLevel2Table'),
    loading: () => import('./Loading')
  },
  methods: {
    async refreshData () {
      this.isLoading = true
      // FIXME: preguntar por el id del cliente correcto
      var response = await api.getAll(this.ulrInstructions + this.idClient)
      // Estuvo exitosa la busqueda
      if (response.status === 200) {
        this.instruccionData = response.data
        this.errors = false
      } else {
        // Se pone vacio para evitar errores
        this.instruccionData = {user_instructions: '', contact_info: '', thanks: ' '}
        this.errors = true
      }

      // Carga las areas
      response = await api.getAll(this.urlAreas)
      // Estuvo exitosa la busqueda
      if (response.status === 200) {
        this.areas = response.data
        this.errors = false
      } else {
        // Se pone vacio para evitar errores
        this.areas = {}
        this.errors = true
      }
      this.isLoading = false
    },
    clone (obj) {
      // var outpurArr = []
      var outputObj = {}
      for (var i in obj) {
        // outpurArr[i] = typeof (obj[i]) === 'object' ? this.clone(obj[i]) : obj[i]
        if (typeof (obj[i]) === 'object') {
          Object.defineProperty(outputObj, this.clone(obj[i]), {value: obj[i], writable: true, enumerable: true, configurable: true})
        } else {
          Object.defineProperty(outputObj, i, {value: obj[i], writable: true, enumerable: true, configurable: true})
        }
      }
      return outputObj
    },
    starForm: function () {
      alert(JSON.stringify(this.participantResponse))
    },
    startSurvey: function () {
      this.isSurveyVisible = true
      // this.inititParticipantResponse()
    },
    onSubmit: function (evt) {
      // the page doesn’t reload when the form is submitted,
      evt.preventDefault()
      // Se activa la visualizacion de las preguntas
      this.showQuestions = true
    },
    async processEnd (responsesList) {
      // Cambia la bandera que controla si se muestra el mensaje de fin de encuesta
      this.isLoading = true
      console.log('Emitio guardado')
      this.participantResponse.responsesList = responsesList
      this.participantResponse.customized_instrument_id = this.instruccionData.id

      var response = await api.create(this.participantResponse, this.urlSaveSubItems)
      if (response.status === 201) {
        // Estuvo exitosa la busqueda
        console.log('Guardado de respuestas en BD fue correcto')
        this.showThanksMessage = true
        this.isLoading = false
      } else {
        this.isLoading = false
      }
    }
  },
  filters: {
    decimalNumbers: function (value) {
      if (!value) return ''
      value = value.toFixed(2)
      return value
    }
  }
}
</script>
