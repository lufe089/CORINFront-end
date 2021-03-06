/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueNumeric from 'vue-numeric'
import App from './App'
import router from './router'
import store from "./store"
import ApiService from "@/services/api.service";
import i18n from './lang/config.js'
import es from 'vee-validate/dist/locale/es'
import VeeValidate from 'vee-validate'
import { Validator } from 'vee-validate'
import BDData from '@/common/_BDData'
// import ErrorFilter from '@/common/error.filter'

Vue.use(BootstrapVue)
    // Plugin para usar formateador de numeros 
Vue.use(VueNumeric)
    // Plugin para controlar validacion de formularios
    // Localize takes the locale object as the second argument (optional) and merges it.
    // Validator.localize('es', es)
    /* Vue.use(VeeValidate, {locale: 'es', dictionary: {
        es: { messages: es }
      }
    }) */
Vue.use(VeeValidate, { locale: 'es', fieldsBagName: 'vvFields' })
    // Vue.filter("error", ErrorFilter)

// Ignora este editor pues parece que hay algun error cuando carga la primera vez aunque el renderizado funciona bn
Vue.config.ignoredElements = ['trix-editor']

//Iniciar el servicio que controla los servicios web
ApiService.init()

Validator.localize('es', es); // changes the locale
Validator.localize('es', BDData.validation_attr_dictionnary.es) // changes the locale
    // Validator.localize('es', dictionary) // changes the locale

/* Vue.use(VeeValidate, {
  events: 'change'
}); */

// Vue.http.headers.common['Access-Control-Allow-Origin'] = '*'
// Vue.http.headers.common['Access-Control-Request-Method'] = '*'

new Vue({
    el: '#app',
    router,
    i18n,
    store,
    template: '<App/>',
    components: {
        App
    }
})