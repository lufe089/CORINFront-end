/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import BDData from '@/common/_BDData'
import i18n from '@/lang/config'
import JwtService from '@/services/jwt.service'
import { SET_LOADING, SET_ERROR } from '@/store/mutations.type'


const client = axios.create({
    baseURL: BDData.API_URL,
    json: true
})

export default {
    data() {
        return {

        }
    },
    async execute(method, resource, data, header) {
        // inject the accessToken for each request
        let accessToken = JwtService.getToken()
        var headersData = {}
            // Para poner el token, solo en los request en los que se necesita enviar el token de autenticacion
        if (header) {
            headersData: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        return client({
            method,
            url: resource,
            data,
            headers: headersData
        }).then(req => {
            // console.log(req)
            // alert(JSON.stringify(req))
            return req
        }).catch(
            function(errorResponse) {
                let errorMsg = ''
                if (errorResponse.response != undefined && errorResponse.response.status != undefined) {
                    switch (errorResponse.response.status) {
                        case 400: // bad request
                            errorMsg = JSON.stringify(errorResponse.response.data)
                            break;
                        case 500: // SERVER ERROR
                            //alert(i18n.tc('message.error_consuming_service_permissions'));
                            var serverError = JSON.stringify(errorResponse.response.data)
                            console.error(serverError)
                            errorMsg = i18n.tc('message.error_consuming_service')
                            break;
                        case 403: // FORBBIDEN
                            //alert(i18n.tc('message.error_consuming_service_permissions'));
                            errorMsg = i18n.tc('message.error_consuming_service_permissions')
                            break;
                        case 404: // NOT FOUND
                            //alert(i18n.tc('message.error_consuming_service_permissions'));
                            errorMsg = i18n.tc('message.error_consuming_not_found')
                            break;
                        default:
                            errorMsg = i18n.tc('message.error_consuming_service')
                            break;
                    }
                } else {
                    if (errorResponse.message === "Network Error") {
                        errorMsg = i18n.tc('message.error_connecting_dataBase')
                    }
                }
                console.error("USER MSG: " + JSON.stringify(errorResponse.response))
                console.error("SERVER ERROR:" + errorMsg)
                throw new Error(errorMsg)
            })
    },
    create(data, path, header = true) {
        var result = this.execute('post', path, data, header)
        return result
    },
    update(id, data, path, header = true) {
        return this.execute('put', path + `${id}` + '/', data, header)
    },
    remove(id, path, header = true) {
        return this.execute('delete', path + `${id}` + '/', header)
    },
    getAll(path, header = true) {
        return this.execute('get', path, header)
    },
    post(data, path, header = true) {
        var result = this.execute('post', path, data, header)
        return result
    }

}