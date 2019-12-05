const axios = require('axios');

// import { MessageBox } from 'mint-ui';

export class Request {
    install(Vue, options) {
        const servceName = options.servceName || "$request";
        Vue.prototype[servceName] = requestFactory(Vue, options);
    }
}

function requestFactory(Vue, options) {
    console.log(options)
    const instance = axios.create({
        baseURL: options.apiUrl,
        timeout: 60000,
        headers: {
            'Content-Type': 'application/json',
            'accessToken': 'FEIGN_REQUEST'
        },
    });
    instance.interceptors.request.use(function (config) {
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    instance.interceptors.response.use(function (response) {
        if (response.data) {
            return Promise.resolve(response.data);
        } else {
            if (response.data.returnMessage || response.data.msg) {
                Vue.$toast(response.data.returnMessage || response.data.msg);
            }
        }
    }, function (error) {
        console.log(error, 666)
        Vue.$toast("链接失败，请核对后再试")
        return Promise.reject(error);
    });
    return instance;
}