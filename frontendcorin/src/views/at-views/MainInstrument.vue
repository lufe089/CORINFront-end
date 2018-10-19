<template>
  <div class="animated fadeIn">
    <div v-show="isLoading">
      <img class="loading" src="https://vignette.wikia.nocookie.net/judo/images/0/03/Cargando.gif/revision/latest?cb=20110601212206&path-prefix=es" alt="loading">
    </div>
    <b-row fluid v-show="!isSurveyVisible && !showThanksMessage">
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
                <span v-html="instruccionData.user_instructions"></span>
                <div slot="footer">
                  <small class="text-muted" v-html="instruccionData.contact_info"></small>
                </div>
                </b-card>
             </b-col>
           </b-row>
        </template>
        <b-btn variant="primary" v-on:click.prevent="startSurvey"  class="float-right">{{$t("message.lets_start")}}</b-btn>
      </b-jumbotron>
      </b-col>
    </b-row>

    <div v-show="isSurveyVisible && !showThanksMessage">
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
                      <b-form-input id="basicEmail" type="email" placeholder=" " v-model.lazy="participantResponse.email" required ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group :description="$t('message.please_enter_area')" :label="$t('message.area')" label-for="area" :label-cols="2"
                      :horizontal="true">
                      <b-form-select id="area" v-model="participantResponse.area" :options="parameters.area" required/>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-group :label="$t('message.es_directivo')" label-for="positionDirective" :label-cols="6"
                      :horizontal="true">
                      <b-form-radio-group id="positionDirective" v-model="participantResponse.is_directive" :options="parameters.position" name="positionDirective"  @change="changeDirectiveVisibility" required></b-form-radio-group>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group v-show ="showDirective" :description="$t('message.seleccion_cargo')" :label="$t('message.cargo')" label-for="cargo" :label-cols="2"
                      :horizontal="true">
                      <b-form-select id="cargo" name="cargo" v-model="participantResponse.position" :options="parameters.directivePositions" :required="showDirective"/>
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
                    <span v-html="instruccionData.thanks"></span>
                  </p>
                </b-alert>
          </b-card>
       </b-col>
    </b-row>
  </div>
</template>
<script>

import BDData from './_BDData.js'
// import itemLevel2Table from './ItemLevel2Table.vue'
import i18n from '../../lang/config'
import axios from 'axios'

export default {
  name: 'main_instrument',
  data () {
    return {
      participantResponse: null,
      serviceResult: {},
      result: '',
      isSurveyVisible: false,
      parameters: BDData.parameters,
      ulrInstructions: BDData.apiURL + 'instructionsSpanish/',
      urlSaveSubItems: BDData.apiURL + 'participantsResponse/',
      selected: [], // Must be an array reference!,
      showDirective: undefined,
      showQuestions: false,
      instruccionData: {user_instructions: '', contact_info: '', thanks: ' '},
      showThanksMessage: false,
      isLoading: true

    }
  },
  mounted () {
    axios(
      { // Este servicio retorna una arreglo de un solo elemento
        method: 'GET', 'url': this.ulrInstructions
      }).then(result => {
      this.instruccionData.user_instructions = result.data[0].user_instructions
      this.instruccionData.contact_info = result.data[0].contact_info
      this.instruccionData.thanks = result.data[0].thanks
      this.isLoading = false
    }, error => {
      console.error(JSON.stringify(error))
      console.error(i18n.tc('message.error_consuming_service_instructions'))
      console.error('Service path:' + this.urlGetItems)
      alert(i18n.tc('message.error_consuming_service'))
      this.isLoading = false
    }
    )
  },
  components: {
    /* tag, component name */
    // itemLevel2Table()
    // dynamic import wrapped in a function
    // 'item-level2-table': () => import('./ItemLevel2Table')
    itemLevel2Table: () => import('./ItemLevel2Table')
  },
  methods: {
    click () {
      // do nothing
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
    changeDirectiveVisibility: function (value) {
      this.showDirective = value
      this.participantResponse.is_directive = this.showDirective
      // Si no es directivo se borra la posicion para que la persona tenga q seleccionar nuevamente
      if (this.showDirective === false) {
        this.participantResponse.position = undefined
      }
    },
    onSubmit: function (evt) {
      // the page doesn’t reload when the form is submitted,
      evt.preventDefault()
      // Se activa la visualizacion de las preguntas
      this.showQuestions = true
    },
    processEnd: function (responsesList) {
      // Cambia la bandera que controla si se muestra el mensaje de fin de encuesta
      this.isLoading = true
      console.log('Emitio guardado')
      this.participantResponse.responsesList = responsesList
      console.log(JSON.stringify(this.participantResponse))
      // console.log(this.$parent.participantResponse.customized_instrument_id)
      axios.post(this.urlSaveSubItems, this.participantResponse).then(response => {
        console.log('Guardado de respuestas en BD fue correcto')
        this.showThanksMessage = true
        this.isLoading = false
      }).catch(function (error) {
        console.error(error)
        alert(i18n.tc('message.error_consuming_save_service'))
        this.isLoading = false
      })
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
  },
  computed: {
  }
}
</script>
