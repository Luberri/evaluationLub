import { get,del, post, put, patch, API_SPRING} from "../util"

export function getAllStatusSpring(params = {}) {
    return get(`${API_SPRING}/status`, params)
}
export function getStatusSpring(id, params = {}) {
    return get(`${API_SPRING}/status/${id}`, params)
}
export function createStatusSpring(data) {
    return post(`${API_SPRING}/status`, data)
}
export function updateStatusSpring(id, data) {
    return put(`${API_SPRING}/status/${id}`, data)
}
export function deleteStatusSpring(id) {
    return del(`${API_SPRING}/status/${id}`)
}
//---------cout

export function getAllCoutSpring(params = {}) {
    return get(`${API_SPRING}/cout`, params)
}

export function createCoutSpring(data) {
    return post(`${API_SPRING}/cout`, data)
}
export function updateCoutSpring(id, data) {
    return put(`${API_SPRING}/cout/${id}`, data)
}
export function deleteCoutSpring(id) {
    return del(`${API_SPRING}/cout/${id}`)
}
export function detailSpring(item) {
    return get(`${API_SPRING}/cout/detail/${item}`)
}
export function deleteAllCoutSpring() {
    return del(`${API_SPRING}/cout`)
}
export function getAllCoutByTicketSpring(idTicket, params = {}) {
    return get(`${API_SPRING}/cout/all/${idTicket}`, params)
}
export function getAllCoutLastSpring(idTicket,params = {}) {
    return get(`${API_SPRING}/cout/lasts/${idTicket}`, params)
}
export function getAllCoutFirstSpring(idTicket,params = {}) {
    return get(`${API_SPRING}/cout/firsts/${idTicket}`, params)
}
export function getCoutSpring(id, params = {}) {
    return get(`${API_SPRING}/cout/${id}`, params)
}


export function getAllCoutByTicketSpringM(idTicket,idCout, params = {}) {
    return get(`${API_SPRING}/cout/allModif/${idTicket}/${idCout}`, params)
}
export function getAllCoutLastSpringM(idTicket,idCout,params = {}) {
    return get(`${API_SPRING}/cout/lastsModif/${idTicket}/${idCout}`, params)
}
export function getAllCoutFirstSpringM(idTicket,idCout,params = {}) {
    return get(`${API_SPRING}/cout/firstsModif/${idTicket}/${idCout}`, params)
}
export function getCoutSpringM(id,idcout, params = {}) {
    return get(`${API_SPRING}/coutModif/${id}/${idcout}`, params)
}