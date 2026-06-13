import { API_URL2, get, del,post,patch, APP_TOKEN, getSession,getAccessToken } from '../util.js';

export function createState(data) {
    return post(`${API_URL2}/Dropdowns/State`, data, {
        Authorization: `Bearer ${getAccessToken()}`
    });
}

export function updateState(id, data) {
    return put(`${API_URL2}/Dropdowns/State/${id}`, data, {
        Authorization: `Bearer ${getAccessToken()}`
    });
}

export function getAllStates(params = {}) {
    return get(`${API_URL2}/Dropdowns/State`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params);
}

export function getState(id, params = {}) {
    return get(`${API_URL2}/Dropdowns/State/${id}`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params);
}

export function supState(id) {
    return del(`${API_URL2}/Dropdowns/State/${id}`, {
        Authorization: `Bearer ${getAccessToken()}`
    });
}

export async function supAllStates() {
    const all = await getAllStates()
    return Promise.all(all.data.map(x => 
        del(`${API_URL2}/Dropdowns/State/${x.id}`, {
            Authorization: `Bearer ${getAccessToken()}`
        })
    ))
}

// ─────────────────────────────────────────────
// LOCATION
// ─────────────────────────────────────────────

export function getAllLocations(params = {}) {
    return get(`${API_URL2}/Dropdowns/Location`, { Authorization: `Bearer ${getAccessToken()}` }, params)
}
export function getLocation(id) {
    return get(`${API_URL2}/Dropdowns/Location/${id}`, { Authorization: `Bearer ${getAccessToken()}` })
}
export function createLocation(data) {
    return post(`${API_URL2}/Dropdowns/Location`, data, { Authorization: `Bearer ${getAccessToken()}` })
}
export function updateLocation(id, data) {
    return put(`${API_URL2}/Dropdowns/Location/${id}`, data, { Authorization: `Bearer ${getAccessToken()}` })
}
export function supLocation(id) {
    return del(`${API_URL2}/Dropdowns/Location/${id}`, { Authorization: `Bearer ${getAccessToken()}` })
}
export async function supAllLocations() {
    const all = await getAllLocations()
    return Promise.all(all.data.map(x =>
        del(`${API_URL2}/Dropdowns/Location/${x.id}`, { Authorization: `Bearer ${getAccessToken()}` })
    ))
}

// ─────────────────────────────────────────────
// MANUFACTURER
// ─────────────────────────────────────────────

export function getAllManufacturers(params = {}) {
    return get(`${API_URL2}/Dropdowns/Manufacturer`, { Authorization: `Bearer ${getAccessToken()}` }, params)
}
export function getManufacturer(id) {
    return get(`${API_URL2}/Dropdowns/Manufacturer/${id}`, { Authorization: `Bearer ${getAccessToken()}` })
}
export function createManufacturer(data) {
    return post(`${API_URL2}/Dropdowns/Manufacturer`, data, { Authorization: `Bearer ${getAccessToken()}` })
}
export function updateManufacturer(id, data) {
    return put(`${API_URL2}/Dropdowns/Manufacturer/${id}`, data, { Authorization: `Bearer ${getAccessToken()}` })
}
export function supManufacturer(id) {
    return del(`${API_URL2}/Dropdowns/Manufacturer/${id}`, { Authorization: `Bearer ${getAccessToken()}` })
}
export async function supAllManufacturers() {
    const all = await getAllManufacturers()
    return Promise.all(all.data.map(x =>
        del(`${API_URL2}/Dropdowns/Manufacturer/${x.id}`, { Authorization: `Bearer ${getAccessToken()}` })
    ))
}

// ─────────────────────────────────────────────
// {Item}Type  — ex: ItemType('Computer')
// ─────────────────────────────────────────────

export function getAllItemTypes(item, params = {}) {
    return get(`${API_URL2}/Dropdowns/${item}Type`, { Authorization: `Bearer ${getAccessToken()}` }, params)
}
export function getItemType(item, id) {
    return get(`${API_URL2}/Dropdowns/${item}Type/${id}`, { Authorization: `Bearer ${getAccessToken()}` })
}
export function createItemType(item, data) {
    return post(`${API_URL2}/Dropdowns/${item}Type`, data, { Authorization: `Bearer ${getAccessToken()}` })
}
export function updateItemType(item, id, data) {
    return put(`${API_URL2}/Dropdowns/${item}Type/${id}`, data, { Authorization: `Bearer ${getAccessToken()}` })
}
export function supItemType(item, id) {
    return del(`${API_URL2}/Dropdowns/${item}Type/${id}`, { Authorization: `Bearer ${getAccessToken()}` })
}
export async function supAllItemTypes(item) {
    const all = await getAllItemTypes(item)
    return Promise.all(all.data.map(x =>
        del(`${API_URL2}/Dropdowns/${item}Type/${x.id}`, { Authorization: `Bearer ${getAccessToken()}` })
    ))
}

// ─────────────────────────────────────────────
// {Item}Model  — ex: ItemModel('Computer')
// ─────────────────────────────────────────────

export function getAllItemModels(item, params = {}) {
    return get(`${API_URL2}/Dropdowns/${item}Model`, { Authorization: `Bearer ${getAccessToken()}` }, params)
}
export function getItemModel(item, id) {
    return get(`${API_URL2}/Dropdowns/${item}Model/${id}`, { Authorization: `Bearer ${getAccessToken()}` })
}
export function createItemModel(item, data) {
    return post(`${API_URL2}/Dropdowns/${item}Model`, data, { Authorization: `Bearer ${getAccessToken()}` })
}
export function updateItemModel(item, id, data) {
    return put(`${API_URL2}/Dropdowns/${item}Model/${id}`, data, { Authorization: `Bearer ${getAccessToken()}` })
}
export function supItemModel(item, id) {
    return del(`${API_URL2}/Dropdowns/${item}Model/${id}`, { Authorization: `Bearer ${getAccessToken()}` })
}
export async function supAllItemModels(item) {
    const all = await getAllItemModels(item)
    return Promise.all(all.data.map(x =>
        del(`${API_URL2}/Dropdowns/${item}Model/${x.id}`, { Authorization: `Bearer ${getAccessToken()}` })
    ))
}
