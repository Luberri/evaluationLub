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
export function getCoutSpring(id, params = {}) {
    return get(`${API_SPRING}/cout/${id}`, params)
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
export async function deleteCoutLast(idTicket) {
    const a = await getAllCoutSpring()
    await Promise.all(
        a.data.map(async (y) => {
            if (idTicket == y.idTicket) {
                await deleteCoutSpring(y.id)
            }
        })
    )
}
export async function CoutLast(idTicket) {
    const a = await getAllCoutSpring()
    const res = a.data.filter(poo=>poo.id == idTicket)
    console.log("resss ")
    return res
}
