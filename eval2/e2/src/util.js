import axios from "axios"
import { ref } from "vue"
export const API_URL2 = '/api/api.php'
export const API_URL1 = '/api/apirest.php'
export const CLIENT_ID = '00d391be927d0a3e7d5c49b6894063e9a2fe48bd1254a94ea3e130e6643b320f'
export const CLIENT_SECRET = '3e0ece61af297d2d56637789228a2ce386ad2c4d8768aacc7faba32089f19c2b'
export const APP_TOKEN = 'qAY61fbMKVZzx0l6cLM3UntXpeezuwzIxuvx3zdp'
export const USER_TOKEN = 'NRgsFoGGku9EvrObynJDa7NznBsIrCHh2ya1fOWT'
export const SESSION_TOKEN = ref(localStorage.getItem("session_token"))
export const ACCESS_TOKEN = ref(localStorage.getItem("access_token"))

export const API_SPRING = 'http://localhost:8081/api'

export let globalSetMessage = null;
export function setGlobalMessageHandler(fn) {
    globalSetMessage = fn;
}

export function get(url, headers = {}, params = {}) {
    console.log(`GET ${url} | params `,params,` | headers`, headers );

    return axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        params: params
    });
}
export function post(url, data = {}, headers = {}) {
    console.log(`POST ${url} | data`, data, "| headers", headers)

    return axios.post(url, data, {
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    }).then(res => {
        if (globalSetMessage) {
            globalSetMessage(`POST ${url} réussi`, false)
        }
        return res;
    }).catch(err => {
        if (globalSetMessage) {
            const msg = err?.response?.data || err.message || `POST ${url} échoué`;
            globalSetMessage(msg, true);
        }
        throw err;
    })
}

export function put(url, data = {}, headers = {}) {
    console.log(`PUT ${url} | data`, data, "| headers", headers)

    return axios.put(url, data, {
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    }).then(res => {
        if (globalSetMessage) {
            globalSetMessage(`PUT ${url} réussi`, false)
        }
        return res;
    }).catch(err => {
        if (globalSetMessage) {
            const msg = err?.response?.data || err.message || `PUT ${url} échoué`;
            globalSetMessage(msg, true);
        }
        throw err;
    })
}
export function del(url, headers = {}) {
    console.log(`DELETE ${url} | headers`, headers)

    return axios.delete(url, {
        headers,
        params: { force: true }
    }).then(res => {
        if (globalSetMessage) {
            globalSetMessage(`DELETE ${url} réussi`, false)
        }        
        return res;
    }).catch(err => {
        if (globalSetMessage) {
            const msg = err?.response?.data || err.message || `DELETE ${url} échoué`;
            globalSetMessage(msg, true);
        }
        throw err;
    })
}
export function patch(url, data = {}, headers = {}) {
    console.log(`PATCH ${url} | data`, data, "| headers", headers)

    return axios.patch(url, data, {
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    }).then(res => {
        if (globalSetMessage) {
            globalSetMessage(`PATCH ${url} réussi`, false)
        }
        return res;
    }).catch(err => {
        if (globalSetMessage) {
            const msg = err?.response?.data || err.message || `PATCH ${url} échoué`;
            globalSetMessage(msg, true);
        }
        throw err;
    })
}
export function initSession(appToken = APP_TOKEN, userToken = USER_TOKEN) {
    const url = `${API_URL1}/initSession`
    return get(url, {
        "App-Token": appToken,
        Authorization: `user_token ${userToken}`
    })
}
export function initTocken(clientId = CLIENT_ID, clientSecret = CLIENT_SECRET , username = "glpi", password = "glpi") {
    const url = `${API_URL2}/token`
    return post(url, 
        {
            grant_type : "password",
            client_id : clientId,
            client_secret : clientSecret,
            username : username,
            password : password,
            scope : "api"
        },
        {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )
}
export function setSession(token) {
    SESSION_TOKEN.value = token
    localStorage.setItem("session_token", token ?? "")
}

export function setAccessToken(token) {
    ACCESS_TOKEN.value = token
    localStorage.setItem("access_token", token ?? "")
}

export function getSession() {
    return localStorage.getItem("session_token")
}

export function getAccessToken() {
    return localStorage.getItem("access_token")
}