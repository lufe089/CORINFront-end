/* eslint-disable */

import { SET_LOADING } from "./mutations.type";

const state = {
    loading: true
};

const getters = {
    isLoading(state) {
        return state.loading
    }
};

const mutations = {
    [SET_LOADING](state, data) {
        // Estos son los datos que llegan cuando la autenticacion es de este tipo 
        state.loading = data;
    }
};

export default {
    state,
    mutations,
    getters
};