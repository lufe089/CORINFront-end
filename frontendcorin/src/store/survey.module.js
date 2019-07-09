/* eslint-disable */

import api from "@/services/api";
import BDData from '@/common/_BDData.js'
import i18n from '@/lang/config'
import {
    FETCH_AREAS,
    FETCH_CATEGORIES,
} from "./actions.type";
import { SET_AREAS, SET_LOADING, SET_ERROR, CLEAR_ERRORS, SET_CATEGORIES } from "./mutations.type";


const state = {
    areas: {},
    subItems: {},
    totalItems: {},
    categories: {}
};

const getters = {
    areas(state) {
        return state.areas
    },
    subItems(state) {
        return state.subItems
    },
    categories(state) {
        return state.categories
    },
    totalItems(state) {
        return state.totalItems
    }
};

const actions = {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    // source https://vuex.vuejs.org/guide/mutations.html
    async [FETCH_AREAS](context, data) {
        context.commit(SET_LOADING, true)
        try {
            // Estuvo exitosa la busqueda
            let response = await api.getAll(BDData.endPoints.areas)
            if (response.status === 200) {
                console.log(response.data);
                context.commit(SET_AREAS, response.data)
            }
        } catch (exception) {
            console.error(JSON.stringify(exception.message))
            context.commit(SET_ERROR, exception.message)
        }
        context.commit(SET_LOADING, false)
    },
    async [FETCH_CATEGORIES](context, data) {
        context.commit(SET_LOADING, true);
        let response = await api.getAll(BDData.endPoints.categories)
            // Estuvo exitosa la busqueda
        if (response.status === 200) {
            console.log(response.data);
            context.commit(SET_CATEGORIES, response.data);
            context.commit(SET_LOADING, false);
        } else {
            //FIXME mirar aqui como llega el error
            context.commit(SET_ERROR, errorMsg);
            context.commit(SET_LOADING, false);
        }
    }
};

const mutations = {
    [SET_AREAS](state, data) {
        // Estos son los datos que llegan cuando la autenticacion es de este tipo 
        state.areas = data;
    },
    [SET_CATEGORIES](state, data) {
        // Estos son los datos que llegan cuando la autenticacion es de este tipo 
        state.categories = data;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};