/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueNumeric from 'vue-numeric'
import App from './App'
import router from './router'
import i18n from './lang/config.js'
import es from 'vee-validate/dist/locale/es'
import VeeValidate from 'vee-validate'
import { Validator } from 'vee-validate'
import BDData from './views/at-views/_BDData.js'
// import VeeValidate, { Validator } from 'vee-validate'

/*
const dictionary = {
  en: {
    attributes: {
      constitutionYear: 'pedro Address'
    }
  },
  es: {  
    attributes: {
      constitutionYear: 'البريد الاليكتروني'
    }
  }
};*/


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
Vue.use(VeeValidate, {locale: 'es'}) 
Validator.localize('es', es); // changes the locale
Validator.localize('es', BDData.validation_attr_dictionnary.es) // changes the locale

/* Vue.use(VeeValidate, {
  events: 'change'
}); */

// Vue.http.headers.common['Access-Control-Allow-Origin'] = '*'
// Vue.http.headers.common['Access-Control-Request-Method'] = '*'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    template: '<App/>',
    components: {
        App
    }
})