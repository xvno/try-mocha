const axios = require('axios');

const { iqiyi } = require('../../conf');

console.log('baseURLs:::');
console.log(iqiyi);
console.log(iqiyi.uac);
console.log(':::');


let uac = axios.create({
    baseURL: iqiyi.uac,
    timeout: 10000
});
let fft = axios.create({
    baseURL: iqiyi.fft,
    timeout: 10000
});
let app = axios.create({
    baseURL: iqiyi.app,
    timeout: 10000
});

uac.interceptors.request.use(
    function(config) {
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

uac.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        return Promise.reject(error);
    }
);

fft.interceptors.request.use(
    function(config) {
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

fft.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        return Promise.reject(error);
    }
);

app.interceptors.request.use(
    function(config) {
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

app.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        return Promise.reject(error);
    }
);

module.exports = {
    uac,
    fft,
    app
};
