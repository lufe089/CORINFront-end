/* eslint-disable */

import api from "@/services/api";
import JwtService from "@/services/jwt.service";
import BDData from '@/common/_BDData.js'
import i18n from '@/lang/config'
import {
    LOGIN_PWD,
    LOGIN_ACCESS_CODE,
    LOGOUT,
    REGISTER,
    CHECK_AUTH,
    UPDATE_USER
} from "./actions.type";
import { SET_AUTH, SET_AUTH_ACCESS_CODE, PURGE_AUTH, SET_ERROR, CLEAR_ERRORS, SET_LOADING, SET_ACTIVE_INSTRUMENT_ID } from "./mutations.type";
import { ADMIN } from '@/store/profiles.type'

const state = {
    user: {},
    customized_instrument: { custom_user_instructions: '', custom_contact_info: '', custom_thanks: ' ' }, // Guarda cual la encuesta que se va a diligenciar
    config_survey: {}, // Guarda la configuracion del survey para saber cuantas encuestas estan autorizadas, etc
    /*    ADMIN = 1
    COMPANY = 2
    CLIENT = 3
    PARTICIPANT = 4 */
    profileType: null, // Por defecto sin perfil a menos que se autentique
    //FIXME decodificar el perfil del token
    isAuthenticated: !!JwtService.getToken(),
    instrument_header_id: null
};

const getters = {
    currentUser(state) {
        return state.user
    },
    isAuthenticated(state) {
        return state.isAuthenticated
    },
    profile(state) {
        return state.profileType
    },
    isAdmin(state) {
        return state.profileType === 1 // admin
    },
    isCompany(state) {
        return state.profileType === 2 // company
    },
    isParticipant(state) {
        return state.profileType === 4 // participant
    },
    isClient(state) {
        return state.profileType === 3 // client
    },
    idActiveInstrumentHeader(state) {
        return state.instrument_header_id
    },
    customizedInstrument(state) {
        return state.customized_instrument
    },
    clientName(state) {
        // Util especialmente cuando el usuario es un cliente o un participante
        if (state.profileType >= 3 && state.user.client != null) {
            return state.user.client.client_company_name
        } else {
            return ''
        }
    },
    showProfileText() {
        var value = ' '
        switch (state.profileType) {
            case 1:
                value = 'Administrador'
                break
            case 2:
                value = 'Compañía'
                break
            case 3:
                value = 'Cliente'
                break
            case 4:
                value = 'Participante'
                break
        }
        return value
    }

};

const actions = {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    // source https://vuex.vuejs.org/guide/mutations.html
    async [LOGIN_ACCESS_CODE](context, data) {
        context.commit(SET_LOADING, true);
        try {
            // El ultimo parametro sirve para indicar que no hay que poner el token de autorizacion a la peticion
            var loginResponse = await api.post(data, BDData.endPoints.loginByAccessCode, false)             
            // Se verifica que todavia haya espacio para crear encuestas personalizadas
            var dataToSend = {idCustomizedInstrument: loginResponse.data.customized_instrument.id}
            var responseCanSave= await api.post(dataToSend, BDData.endPoints.isAllowedSave)
            if (responseCanSave.status === 200) {
                this.obj = responseCanSave.data
                if (this.obj.save === true) {
                    console.log(loginResponse.data)
                    context.commit(SET_AUTH_ACCESS_CODE, loginResponse.data);
                    context.commit(CLEAR_ERRORS)  
                } else if (this.obj.save === false) {
                    context.commit(SET_ERROR, i18n.tc('message.error_no_espacio_guardar_encuesta'))
                }
            }
        } catch (exception) {
            // Here we could override the busy state, setting isBusy to false
            console.error(JSON.stringify(exception.message))
            context.commit(SET_ERROR, exception.message)
        }
        context.commit(SET_LOADING, false)
    },
    async [LOGIN_PWD](context, data) {
        try {
            // El ultimo parametro sirve para indicar que no hay que poner el token de autorizacion a la peticion
            // La accion se vuelve una promesa para manejar la parte asincrona
            let response = await api.post(data, BDData.endPoints.loginByPwd, false)
            if (response.status === 200) {
                console.log(response.data)
                context.commit(SET_AUTH, response.data) // Data tiene los datos del user
                let response2 = await api.getAll(BDData.endPoints.activeInstrumentHeader)
                context.commit(SET_ACTIVE_INSTRUMENT_ID, response2.data) // Data es el header del instrumento activo
            }
        } catch (exception) {
            console.error(JSON.stringify(exception.message))
            context.commit(SET_ERROR, exception.message)
        }
    },
    [LOGOUT](context) {
        context.commit(PURGE_AUTH);
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
        state.isAuthenticated = true
        state.profileType = data.profileType
        state.customized_instrument = data.customized_instrument
        state.config_survey = data.config_survey
        state.errors = {}
        state.instrument_header_id = data.config_survey.instrument_header_id
        JwtService.saveToken(data.token)
        var user = {}
        user.company = state.config_survey.client.company
        user.client = state.config_survey.client
        user.company_id = user.company.id
        user.client_id = user.client.id
        user.profileType = data['profileType']
        user.token = data['token']
        user.email = ''
            // A partir de los datos recibidos creo un "fake user" que tenga la info de la compañía y del cliente
            // al que pertenece el participante
        state.user = user
    },
    [SET_ACTIVE_INSTRUMENT_ID](state, data) {
        state.instrument_header_id = data.id
    },
    [SET_AUTH](state, user) {
        state.isAuthenticated = true
        state.user = user
        state.profileType = user.profileType
        state.errors = {}
    },
    [PURGE_AUTH](state) {
        state.isAuthenticated = false
        state.user = {}
        state.errors = {}
        state.profileType = null
        JwtService.destroyToken()
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
