/* eslint-disable */
/*
 VueI18n instance inspiration from  https://kuanhsuh.github.io/How-to-implement-multi-language-with-Vue-i18n.html

 API URL https://kazupon.github.io/vue-i18n/api/#silenttranslationwarn
 https://kazupon.github.io/vue-i18n/guide/migrations.html#features
 */

import VueI18n from 'vue-i18n'
import Vue from 'vue'
import messages from './messages.js'

/* Add instruction to use the i18n plugin */
Vue.use(VueI18n)

const locale = 'es'
const i18n = new VueI18n({
    locale,
    messages
})

export default i18n