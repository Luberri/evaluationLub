import { API_URL2, get, post, put,del, patch, getSession, getAccessToken } from "../util";

export function getAllUser(params = {}) {
	return get(`${API_URL2}/Administration/User`, {
		Authorization: `Bearer ${getAccessToken()}`
	}, params)
}

export function createUser(data) {
	return post(`${API_URL2}/Administration/User`, data, {
		Authorization: `Bearer ${getAccessToken()}`
	})
}

export function getUser(id, params = {}) {
	return get(`${API_URL2}/Administration/User/${id}`, {
		Authorization: `Bearer ${getAccessToken()}`
	}, params)
}

export function deleteUser(id) {
	return del(`${API_URL2}/Administration/User/${id}`, {
		Authorization: `Bearer ${getAccessToken()}`
	})
}