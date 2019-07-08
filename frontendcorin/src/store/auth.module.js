/* eslint-disable */

import api from "@/services/api";
import JwtService from "@/services/jwt.service";
import BDData from '@/common/_BDData.js'
import i18n from '@/lang/config'
import {
    LOGIN,
    LOGIN_ACCESS_CODE,
    LOGOUT,
    REGISTER,
    CHECK_AUTH,
    UPDATE_USER
} from "./actions.type";
import { SET_AUTH, SET_AUTH_ACCESS_CODE, PURGE_AUTH, SET_ERROR, CLEAR_ERRORS, SET_LOADING } from "./mutations.type";
import { ADMIN } from '@/store/profiles.type'

const state = {
    user: {},
    customized_instrument: { custom_user_instructions: '', custom_contact_info: '', custom_thanks: ' ' }, // Guarda cual la encuesta que se va a diligenciar
    config_survey: {}, // Guarda la configuracion del survey para saber cuantas encuestas estan autorizadas, etc
    /*    ADMIN = 1
    COMPANY = 2
    CLIENT = 3
    PARTICIPANT = 4 */
    profile: null, // Por defecto sin perfil a menos que se autentique
    //FIXME decodificar el perfil del token
    isAuthenticated: !!JwtService.getToken()
};

const getters = {
    currentUser(state) {
        return state.user
    },
    isAuthenticated(state) {
        return state.isAuthenticated
    },
    profile(state) {
        return state.profile
    },
    isAdmin(state) {
        return state.profile === 1 // admin
    },
    customizedInstrument(state) {
        return state.customized_instrument
    }

};

const actions = {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    // source https://vuex.vuejs.org/guide/mutations.html
    [LOGIN_ACCESS_CODE](context, data) {
        context.commit(SET_LOADING, true);
        return new Promise(resolve => {
            api.post(data, BDData.endPoints.loginByAccessCode)
                .then(response => {
                    alert(JSON.stringify(response.data))
                    console.log(response.data)
                    context.commit(SET_AUTH_ACCESS_CODE, response.data);
                    context.commit(CLEAR_ERRORS)
                    resolve(response.data);
                }).catch(error => {
                    // Here we could override the busy state, setting isBusy to false
                    console.error(JSON.stringify(error.message))
                    context.commit(SET_ERROR, error.message)
                }).finally(
                    context.commit(SET_LOADING, false)
                )
        });
    },
    [LOGIN](context, credentials) {
        // La accion se vuelve una promesa para manejar la parte asincrona
        return new Promise(resolve => {
            ApiService.post("users/login", { user: credentials })
                .then(({ data }) => {

                    context.commit(SET_AUTH, data.user);
                    resolve(data);
                })
                .catch(({ response }) => {
                    context.commit(SET_ERROR, response.data.errors);
                });
        });
    },
    [LOGOUT](context) {
        context.commit(PURGE_AUTH);
    },
    [REGISTER](context, credentials) {
        return new Promise((resolve, reject) => {
            ApiService.post("users", { user: credentials })
                .then(({ data }) => {
                    context.commit(SET_AUTH, data.user);
                    resolve(data);
                })
                .catch(({ response }) => {
                    context.commit(SET_ERROR, response.data.errors);
                    reject(response);
                });
        });
    },
    [CHECK_AUTH](context) {
        if (JwtService.getToken()) {
            ApiService.setHeader();
            ApiService.get("user")
                .then(({ data }) => {
                    context.commit(SET_AUTH, data.user);
                })
                .catch(({ response }) => {
                    context.commit(SET_ERROR, response.data.errors);
                });
        } else {
            context.commit(PURGE_AUTH);
        }
    },
    [UPDATE_USER](context, payload) {
        const { email, username, password, image, bio } = payload;
        const user = {
            email,
            username,
            bio,
            image
        };
        if (password) {
            user.password = password;
        }

        return ApiService.put("user", user).then(({ data }) => {
            context.commit(SET_AUTH, data.user);
            return data;
        });
    }
};

const mutations = {
    [SET_AUTH_ACCESS_CODE](state, data) {
        // Estos son los datos que llegan cuando la autenticacion es de este tipo 
        state.isAuthenticated = true;
        state.profile = data.profile;
        state.customized_instrument = data.customized_instrument
        state.config_survey = data.config_survey
        state.errors = {};
        JwtService.saveToken(data.token);
    },
    [SET_AUTH](state, user) {
        state.isAuthenticated = true;
        state.user = user;
        state.errors = {};
        JwtService.saveToken(state.user.token);
    },
    [PURGE_AUTH](state) {
        state.isAuthenticated = false;
        state.user = {};
        state.errors = {};
        JwtService.destroyToken();
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};