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
    async execute(method, resource, data) {
        // inject the accessToken for each request
        let accessToken = JwtService.getToken()
        return client({
            method,
            url: resource,
            data,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
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
                            errorMsg = errorResponse.response.data.non_field_errors[0] // Cuando django contesta se toma el primer elemento
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
                console.log(JSON.stringify(errorResponse.response))
                console.log(`ApiService ${errorMsg}`)
                throw new Error(errorMsg)
            })
    },
    getClients() {
        //OJO AL final no lo use pq lo integré todo con el excecute q me pareció una solución mas elegante 
        // Here we don't set isBusy prop, so busy state will be handled by table itself
        this.isBusy = true
        let promise = axios.get(this.urlClients)

        return promise.then((response) => {
            this.items = response.data
                // Here we could override the busy state, setting isBusy to false
            this.isBusy = false
            return (this.items)
        }).catch(error => {
            // Here we could override the busy state, setting isBusy to false
            this.isBusy = false
            console.error(error)
            console.error(i18n.tc('message.error_consuming_service', this.urlClients))
            console.error('Service path:' + this.urlClients)
            alert(i18n.tc('message.error_consuming_service'))
                // Returning an empty array, allows table to correctly handle busy state in case of error
            return error
        })
    },
    create(data, path) {
        var result = this.execute('post', path, data)
        return result
    },
    update(id, data, path) {
        return this.execute('put', path + `${id}` + '/', data)
    },
    remove(id, path) {
        return this.execute('delete', path + `${id}` + '/')
    },
    getAll(path) {
        return this.execute('get', path)
            /* this.execute('get', path)
                .then(
                    function(response) {
                        return response
                    }
                )
                .catch(
                    function(error) {
                        this.$store.commit(SET_ERROR, error)
                    }
                ) */
    },
    post(data, path) {
        var result = this.execute('post', path, data)
        return result
    }

}