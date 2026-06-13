import { API_URL1, API_URL2, get, post, put,patch, getSession, getAccessToken } from "../util";
import { getItem } from "./item";
export const TICKET_STATUS = {
        1: "Nouveau",
        2: "En cours (attribué)",
        3: "En attente",
        4: "Planifié",
        5: "Résolu",
        6: "Clos"
};  
export const TICKET_TYPE = {
    1: "Incident",
    2: "Demande",
}
export const TICKET_IMPACT = {
  1: "Très faible",
  2: "Faible",
  3: "Moyen",
  4: "Élevé",
  5: "Critique"
};

export const TICKET_URGENCY = TICKET_IMPACT
export const TICKET_PRIORITY = TICKET_IMPACT

export function getAllTicket(params = {}) {
    return get(`${API_URL2}/Assistance/Ticket`, {
        Authorization: `Bearer ${getAccessToken()}`
    },
    { start: 0, limit: 999, ...params }
)
}

export function getTicket(id, params = {}) {
    return get(`${API_URL2}/Assistance/Ticket/${id}`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params)
}

export function updateTicket(id, data) {
    return patch(`${API_URL2}/Assistance/Ticket/${id}`, data, {
        Authorization: `Bearer ${getAccessToken()}`,
    })
}
export async function addTicketItem(id, data) {
  console.log(`Ajout de l'item ${data.itemtype} #${data.items_id} au ticket ${id}`)
  const items = await getTicket(id).then(res => res.data.items ?? [])
  const normalizedItems = items.map(item => ({
    itemtype: item.itemtype,
    items_id: item.items_id
  }))
  return patch(`${API_URL2}/Assistance/Ticket/${id}`, { items: [...normalizedItems, data] }, {
    Authorization: `Bearer ${getAccessToken()}`,
  })
}
export function createTicket(data) {
    return post(`${API_URL2}/Assistance/Ticket`, data, {
        Authorization: `Bearer ${getAccessToken()}`,
    })
}

//------------------------------------
export const TICKET_USER_ROLE = {
    1: "requester",
    2: "assigned",
    3: "observer"
}
export const TICKET_USER_TYPE = {
    1: "User",
    2: "Group",
    3: "Supplier"
}
export function createTicketTeamMember(ticketId, data) {
    return post(`${API_URL2}/Assistance/Ticket/${ticketId}/TeamMember`, data, {
        Authorization: `Bearer ${getAccessToken()}`,
    })
}
export function updateTicketTeamMember(id, data) {
    return patch(`${API_URL2}/Assistance/Ticket/${id}/TeamMember`, data, {
        Authorization: `Bearer ${getAccessToken()}`
    })
}
export function getTicketTeamMember(id, params = {}) {
    return get(`${API_URL2}/Assistance/Ticket/${id}/TeamMember`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params)
}

//----------------------------
export async function getTicketItems(id, params = {}) {
    const ticket = await getTicket(id)
    let res = []
    if (ticket.data?.items?.[0]) {
        res = await Promise.all(ticket.data.items.map(async (item) => {
            try {
                const resItem = await getItem(item.itemtype, item.items_id) // ← items_id
                return { ...resItem.data, itemtype: item.itemtype, items_id: item.items_id }
            } catch (error) {
                return null
            }
        }))
    }
    return res.filter(Boolean)
}
//------------------------------cost
export async function getAllCosts(idTicket,params = {}) {
    return get(`${API_URL2}/Assistance/Ticket/${idTicket}/Cost`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params)
}
export async function getCost(idTicket, idCost, params = {}) {
    return get(`${API_URL2}/Assistance/Ticket/${idTicket}/Cost/${idCost}`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params)
}
export async function createCost(idTicket, data) {
    return post(`${API_URL2}/Assistance/Ticket/${idTicket}/Cost`, data, {
        Authorization: `Bearer ${getAccessToken()}`,
    })
}
export async function updateCost(idTicket, idCost, data) {
    return patch(`${API_URL2}/Assistance/Ticket/${idTicket}/Cost/${idCost}`, data, {
        Authorization: `Bearer ${getAccessToken()}`,
    })
}
export async function deleteCost(idTicket, idCost) {
    return patch(`${API_URL2}/Assistance/Ticket/${idTicket}/Cost/${idCost}`, { is_deleted: true }, {
        Authorization: `Bearer ${getAccessToken()}`,
    })
}
//-------------------------------
export async function getAllSolution(idTicket, params = {}) {
    return get(`${API_URL2}/Assistance/Ticket/${idTicket}/Timeline/Solution`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params)
}
export async function getSolution(idTicket, idSolution, params = {}) {
    return get(`${API_URL2}/Assistance/Ticket/${idTicket}/Timeline/Solution/${idSolution}`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params)
}
export async function createSolution(idTicket, data) {
    return post(`${API_URL2}/Assistance/Ticket/${idTicket}/Timeline/Solution`, data, {
        Authorization: `Bearer ${getAccessToken()}`,
    })
}
export async function updateSolution(idTicket, idSolution, data) {
    return patch(`${API_URL2}/Assistance/Ticket/${idTicket}/Timeline/Solution/${idSolution}`, data, {
        Authorization: `Bearer ${getAccessToken()}`,
    })
}
export async function deleteSolution(idTicket, idSolution) {
    return patch(`${API_URL2}/Assistance/Ticket/${idTicket}/Timeline/Solution/${idSolution}`, { is_deleted: true }, {
        Authorization: `Bearer ${getAccessToken()}`,
    })
}