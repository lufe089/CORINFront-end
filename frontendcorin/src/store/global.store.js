/* eslint-disable */

import { SET_LOADING, SET_ERROR, CLEAR_ERRORS } from "./mutations.type";

const state = {
    loading: false,
    errors: []
};

const getters = {
    isLoading(state) {
        return state.loading
    },
    getErrors(state) {
        return state.errors
    },
    hasErrors(state) {
        return state.errors.length > 0
    }
};

const mutations = {
    [SET_LOADING](state, data) {
        // Estos son los datos que llegan cuando la autenticacion es de este tipo 
        state.loading = data;
    },
    [SET_ERROR](state, error) {
        state.errors.push(error)
    },
    [CLEAR_ERRORS](state) {
        state.errors = []
    },
};

export default {
    state,
    mutations,
    getters
};