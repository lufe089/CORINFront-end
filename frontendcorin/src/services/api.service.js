/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from '@/services/jwt.service'
import BDData from '@/common/_BDData'

/* Modified from  https://github.com/gothinkster/vue-realworld-example-app/blob/master/src/common/api.service.js*/

const ApiService = {
    init() {
        Vue.use(VueAxios, axios);
        Vue.axios.defaults.baseURL = BDData.API_URL;
    },

    setHeader() {
        Vue.axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${JwtService.getToken()}`;
    },

    query(resource, params) {
        return Vue.axios.get(resource, params).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },

    get(resource, slug = "", header = true) {
        // MOD luisa: pone las credenciales para autenticar
        if (header) {
            this.setHeader()
        }
        return Vue.axios.get(`${resource}/${slug}`).catch(error => {
            throw new Error(`ApiService ${error}`);
        });
    },

    post(resource, params) {
        return Vue.axios.post(`${resource}`, params);
    },

    update(resource, slug, params) {
        return Vue.axios.put(`${resource}/${slug}`, params);
    },

    put(resource, params) {
        return Vue.axios.put(`${resource}`, params);
    },

    delete(resource) {
        return Vue.axios.delete(resource).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    }
};

export default ApiService;

export const TagsService = {
    get() {
        return ApiService.get("tags");
    }
};

export const ArticlesService = {
    query(type, params) {
        return ApiService.query("articles" + (type === "feed" ? "/feed" : ""), {
            params: params
        });
    },
    get(slug) {
        return ApiService.get("articles", slug);
    },
    create(params) {
        return ApiService.post("articles", { article: params });
    },
    update(slug, params) {
        return ApiService.update("articles", slug, { article: params });
    },
    destroy(slug) {
        return ApiService.delete(`articles/${slug}`);
    }
};

export const CommentsService = {
    get(slug) {
        if (typeof slug !== "string") {
            throw new Error(
                "[RWV] CommentsService.get() article slug required to fetch comments"
            );
        }
        return ApiService.get("articles", `${slug}/comments`);
    },

    post(slug, payload) {
        return ApiService.post(`articles/${slug}/comments`, {
            comment: { body: payload }
        });
    },

    destroy(slug, commentId) {
        return ApiService.delete(`articles/${slug}/comments/${commentId}`);
    }
};

export const SurveyServices = {
    add(slug) {
        return ApiService.post(`articles/${slug}/favorite`);
    },
    remove(slug) {
        return ApiService.delete(`articles/${slug}/favorite`);
    },
    loadQuestions(slug) {

    }
};