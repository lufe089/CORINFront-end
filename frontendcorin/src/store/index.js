/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

// import home from "./home.module";
import auth from "./auth.module";
import survey from "./survey.module";
import global from "@/store/global.store.js";

//Importante para decir que vamos a usar este modulo de vuex. Luego el store tiene que agregar en el main.js
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        survey,
        global
    }
});