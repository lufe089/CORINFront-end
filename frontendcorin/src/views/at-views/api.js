/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import BDData from './_BDData'
import i18n from '../../lang/config'

const client = axios.create({
    baseURL: BDData.apiURL,
    json: true
})

export default {
    data() {
        return {
            // Real data
            // urlClients: 'clients/',

        }
    },
    async execute(method, resource, data) {
        // inject the accessToken for each request
        // let accessToken = await Vue.prototype.$auth.getAccessToken()
        return client({
            method,
            url: resource,
            data
            /* headers: {
              Authorization: `Bearer ${accessToken}`
            } */
        }).then(req => {
            // console.log(req)
            // alert(JSON.stringify(req))
            return req
        }).catch(error => {
            // Here we could override the busy state, setting isBusy to false
            console.error(JSON.stringify(error))
            console.error(error)
            alert(i18n.tc('message.error_consuming_service'))
                // Returning an empty array, allows table to correctly handle busy state in case of error
            return error.response
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
    },
    getWithPost(data, path) {
        var result = this.execute('post', path, data)
        return result
    }

}