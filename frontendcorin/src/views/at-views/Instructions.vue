<template>
 <div class="wrapper">
    <div class="animated fadeIn">
      <b-jumbotron bg-variant="light">
        <template slot="header">
          <!--<b-img fluid center src="https://applies.variamos.com/wp-content/uploads/2018/06/cropped-APPLIES-logo-8.png" height="40%"/>-->
          <span class="text-center" v-html="$t('message.welcome_to_applies')"></span>
          <hr class="my-4">
        </template>
        <template slot="lead">
           <b-row fluid>
             <b-col md="12">
               <b-card class="mx-auto" border-variant="info">
                <span v-html="result[0].user_instructions"></span>
                <div slot="footer">
                  <small class="text-muted" v-html="result[0].contact_info"></small>
                </div>
                </b-card>
             </b-col>
           </b-row>
        </template>
        <b-btn variant="primary" href="#" class="float-right">{{$t("message.lets_start")}}</b-btn>
      </b-jumbotron>
      El servicio: {{result}}
  </div>
 </div>
</template>

<script>
import axios from 'axios'
import i18n from '../../lang/config'
// import BDData from './_BDData.js'

export default {
  name: 'instrument-instructions',
  data () {
    return {
      result: '',
      urlService: 'http://127.0.0.1:8000/instructionsSpanish/'
    }
  },
  methods: { },
  created () {
  },
  computed: {
  },
  mounted () {
    axios(
      { // Este servicio retorna una arreglo de un solo elemento
        method: 'GET', 'url': this.urlService
      }).then(result => {
      this.result = result.data
    }, error => {
      console.error(error)
      console.error(i18n.tc('message.error_consuming_service_instructions'))
      console.error('Service path:' + this.urlGetItems)
      alert(i18n.tc('message.error_consuming_service'))
    })

    /* axios.get(this.urlService, {
    }).then(res => {
      console.log(res)
    }).catch(error => {
      console.log('error', error)
      alert(i18n.tc('message.error_consuming_service'))
    }) */
  },
  filter: { },
  directives: { },
  mixins: []
}
</script>

<style scoped>
</style>
