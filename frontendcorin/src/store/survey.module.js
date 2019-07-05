/* eslint-disable */

import ApiService from "@/services/api.service";
import BDData from '@/common/_BDData.js'
import i18n from '@/lang/config'
import {
    FETCH_AREAS
} from "./actions.type";
import { SET_AREAS } from "./mutations.type";


const state = {
    areas: {}
};

const getters = {
    areas(state) {
        return state.areas
    }
};

const actions = {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    // source https://vuex.vuejs.org/guide/mutations.html

    async [FETCH_AREAS](context, data) {

        let response = await ApiService.get(BDData.endPoints.urlAreas)
            // Estuvo exitosa la busqueda
        if (response.status === 200) {
            console.log(response.data)
            context.commit(SET_AREAS, response.data);
            // resolve(response.data);
        } else {
            //FIXME mirar aqui como llega el error
            context.commit(SET_ERROR, errorMsg);
        }
        /*
        return new Promise(resolve => {
            ApiService.get(BDData.endPoints.urlAreas)
                .then(response => {
                    alert(JSON.stringify(response.data))
                    console.log(response.data)
                    context.commit(SET_AREAS, response.data);
                    resolve(response.data);
                }).catch(error => {
                    // Here we could override the busy state, setting isBusy to false
                    console.error(JSON.stringify(error))
                    let errorMsg = ''
                    if (error.response != undefined && error.response.status != undefined) {

                        switch (error.response.status) {
                            case 400: // bad request
                                errorMsg = error.response.data.non_field_errors
                                    // alert(error.response.data['non_field_errors'])
                                break;
                            case 403: // FORBBIDEN
                                //alert(i18n.tc('message.error_consuming_service_permissions'));
                                errorMsg = i18n.tc('message.error_consuming_service_permissions')
                                break;
                            default:
                                // alert(i18n.tc('message.error_consuming_service'))
                                errorMsg = i18n.tc('message.error_consuming_service_permissions')
                                break;
                        }
                    } else {
                        if (error.message === "Network Error") {
                            errorMsg = i18n.tc('message.error_connecting_dataBase')
                        }
                    }
                    context.commit(SET_ERROR, errorMsg);
                })
        });*/
    },
};

const mutations = {
    [SET_AREAS](state, data) {
        // Estos son los datos que llegan cuando la autenticacion es de este tipo 
        state.areas = data;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};