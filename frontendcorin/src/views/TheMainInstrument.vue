<template>
  <div class="animated fadeIn">
    <!--<div v-show="isLoading">
      <img class="loading" src="https://vignette.wikia.nocookie.net/judo/images/0/03/Cargando.gif/revision/latest?cb=20110601212206&path-prefix=es" alt="loading">
    </div>-->
    <b-row>
      <b-col md="12">
        <client-selector @client-selector:change='refreshData'></client-selector>
      </b-col>
    </b-row>
    <!--<b-alert variant="danger" :show="errorMsg !=='' && errors"><h4>{{errorMsg}}</h4></b-alert>-->
    <!-- Mensaje de bienvenida -->
    <b-row fluid v-show="!isSurveyVisible && !showThanksMessage && idClient != null">
      <b-col md=12>
         <b-jumbotron bg-variant="light">
        <template slot="header">
          <span class="text-center" v-html="$t('message.welcome')"></span>
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
        <b-btn variant="primary" v-on:click.prevent="startSurvey" v-show="!hasErrors" class="float-right">{{$t("message.lets_start")}}</b-btn>
      </b-jumbotron>
      </b-col>
    </b-row>
    <!-- Encabezado de la encuesta -->
    <div v-show="isSurveyVisible && !showThanksMessage && !hasErrors">
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
                    <b-form-group :description="$t('message.please_enter_email')" :label="$t('message.email')" label-for="email" :label-cols="2"
                      :horizontal="true">
                      <b-form-input id="email" type="email" placeholder=" " autocomplete='email' v-model.lazy="participantResponse.email" required v-validate="'required|email'" name='email'></b-form-input>
                      <p class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</p>
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
        <the-main-instrument-tables-items hover @item-level2-table:change='processEnd'></the-main-instrument-tables-items>
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

import BDData from '@/common/_BDData.js'
import api from '@/services/api.js'
import i18n from '@/lang/config'
import { mapGetters } from 'vuex'
import { FETCH_AREAS } from '@/store/actions.type'
import { SET_LOADING, SET_ERROR, CLEAR_ERRORS } from '@/store/mutations.type'

export default {
  name: 'the_main_instrument',
  data () {
    return {
      participantResponse: null,
      serviceResult: {},
      result: '',
      isSurveyVisible: false,
      parameters: BDData.parameters,
      // FIXME
      idClient: null,
      selected: [], // Must be an array reference!,
      showDirective: undefined,
      showQuestions: false,
      showThanksMessage: false,
      isLoading: null,
      instruccionData: {}
    }
  },
  async created () {
    /* Duplicar aqui toda la informacion que pueda cambiar por cada persona que response el instrumento
    para tomar como objeto de referencia el json que esta en el archivo parametrico pero no modificarlo */
    this.participantResponse = this.clone(BDData.participantResponse)
    if (!this.isAdmin) {
      // Si el usuario no es admin, entonces se consulta para que cliente se hara la busqueda
      // y también las areas
      this.refreshDataNoAdmin()
    } // Logica en caso de que si sea admin y tenga que funcionar el selector
  },
  components: {
    /* tag, component name */
    // itemLevel2Table()
    // dynamic import wrapped in a function
    // 'item-level2-table': () => import('./ItemLevel2Table')
    theMainInstrumentTablesItems: () => import('@/components/BusinessLogic/TheMainInstrumentTablesItems'),
    clientSelector: () => import('@/components/BusinessLogic/ClientSelector')
  },
  methods: {
    async loadAreas () {
      this.$store.dispatch(FETCH_AREAS)
    },
    refreshDataNoAdmin: function () {
      this.loadAreas()
      if (this.isParticipant || this.isClient) {
        this.idClient = this.currentUser.client_id
        // Se llama el metodo que consulta los datos para el cliente
        this.refreshData(this.idClient)
      }
    },
    async refreshData (idClient) {
      // Este metodo funciona en el caso de que el usuario sea un administrador
      this.$store.commit(SET_LOADING, true)
      this.idClient = idClient
      let data = {idClient: idClient} // let hace que exista solo scope de bloque
      try {
        var response = await api.post(data, BDData.endPoints.ulrInstructions)
        // Estuvo exitosa la busqueda
        if (response.status === 200) {
          this.obj = response.data
          if (this.obj.error === undefined) {
            this.instruccionData = response.data
            this.loadAreas()
            this.$store.commit(CLEAR_ERRORS)
          } else if (this.obj.error === 'config_survey') {
            this.showData = false
            this.errorMsg = i18n.tc('message.error_configuracion_cliente')
            this.$store.commit(SET_ERROR, this.errorMsg)
          } else if (this.obj.error === 'no_customized_instrument') {
            this.showData = false
            this.errorMsg = i18n.tc('message.error_configuracion_encuesta')
            this.$store.commit(SET_ERROR, this.errorMsg)
          }
        }
      } catch (exception) {
        // Se pone vacio para evitar errores
        this.instruccionData = {user_instructions: '', contact_info: '', thanks: ' '}
        this.$store.commit(SET_ERROR, exception.message)
      }
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
      // Si se puede dar click al boton se limpian los errores de la lista para que se muestren solo los erroes
      // que llegasen a ocurrir en la siguiente ventana
      this.$store.commit(CLEAR_ERRORS)
    },
    onSubmit: function (evt) {
      // the page doesn’t reload when the form is submitted,
      evt.preventDefault()
      // Se validan los resultados
      this.$validator.validate().then(result => {
        // Si no hay errores
        if (result) {
          // Se activa la visualizacion de las preguntas
          this.showQuestions = true
        }
      })
    },
    async processEnd (responsesList) {
      // Cambia la bandera que controla si se muestra el mensaje de fin de encuesta
      this.$store.commit(SET_LOADING, true)
      console.log('Emitio guardado')
      this.participantResponse.responsesList = responsesList
      this.participantResponse.customized_instrument_id = this.instruccionData.id
      // Consulta si se puede guardar
      var data = {idCustomizedInstrument: this.participantResponse.customized_instrument_id}
      // Para verificar que todavia haya espacio para guardar el survey
      try {
        var response = await api.post(data, BDData.endPoints.isAllowedSave)
        // Estuvo exitosa la busqueda
        if (response.status === 200) {
          this.obj = response.data
          if (this.obj.save === true) {
            response = await api.create(this.participantResponse, BDData.endPoints.urlSaveSubItems)
            this.obj = response.data
            if (this.obj.error === undefined && response.status === 201) {
              console.log('Guardado de respuestas en BD fue correcto')
              this.$store.commit(CLEAR_ERRORS)
              this.showThanksMessage = true
            }
          } else if (this.obj.save === false) {
            this.showThanksMessage = false
            this.errorMsg = i18n.tc('message.error_no_espacio_guardar_encuesta')
            this.hasErrors = true
          }
        }
      } catch (exception) {
        this.$store.commit(SET_ERROR, exception.message)
      }
      this.$store.commit(SET_LOADING, false)
    }
  },
  filters: {
    decimalNumbers: function (value) {
      if (!value) return ''
      value = value.toFixed(2)
      return value
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser', 'profile', 'isAdmin', 'isParticipant', 'isClient', 'customizedInstrument', 'areas', 'hasErrors']) // Trae los getters
  }
}
</script>
