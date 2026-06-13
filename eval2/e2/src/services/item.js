import { API_URL1, API_URL2, get, post, put,patch, getSession, getAccessToken } from "../util";
const EXTRA_TYPES = [
    { itemtype: "Rack", name: "Baie", href: "/Assets/Rack" },
    { itemtype: "Enclosure", name: "Châssis", href: "/Assets/Enclosure" },
    { itemtype: "PDU", name: "PDU", href: "/Assets/PDU" },
    { itemtype: "Software", name: "Logiciel", href: "/Assets/Software" },
    { itemtype: "Cable", name: "Câble", href: "/Assets/Cable" },
    { itemtype: "Consumable", name: "Consomable", href: "/Assets/Consumable" }
]

const TYPES = [
    { itemtype: "Computer", name: "Ordinateur", href: "/Assets/Computer" },
    { itemtype: "Monitor", name: "Écran", href: "/Assets/Monitor" },
    // { itemtype: "NetworkEquipment", name: "Équipement réseau", href: "/Assets/NetworkEquipment" },
    // { itemtype: "Peripheral", name: "Périphérique", href: "/Assets/Peripheral" },
    { itemtype: "Phone", name: "Téléphone", href: "/Assets/Phone" },
    // { itemtype: "Printer", name: "Imprimante", href: "/Assets/Printer" },
    // { itemtype: "SoftwareLicense", name: "Licence de logiciel", href: "/Assets/SoftwareLicense" },
    // { itemtype: "Certificate", name: "Certificat", href: "/Assets/Certificate" },
    // { itemtype: "Unmanaged", name: "Non géré", href: "/Assets/Unmanaged" },
    // { itemtype: "Appliance", name: "Dispositif", href: "/Assets/Appliance" },
    // { itemtype: "Rack", name: "Baie", href: "/Assets/Rack" },
    // { itemtype: "Enclosure", name: "Châssis", href: "/Assets/Enclosure" },
    // { itemtype: "PDU", name: "PDU", href: "/Assets/PDU" },
    // { itemtype: "Software", name: "Logiciel", href: "/Assets/Software" },
    // { itemtype: "Cable", name: "Câble", href: "/Assets/Cable" },
    // { itemtype: "Consumable", name: "Consomable", href: "/Assets/Consumable" }
];
// export async function listItems(params = {}) {
//     const res = await get(`${API_URL2}/Assets`, {
//         Authorization: `Bearer ${getAccessToken()}`
//     }, params)
//     res.data = [...res.data]
//     return res
// }

export async function listItems(params = {}) {
    const res = []
    res.data = [...TYPES]
    return res
}
export async function ItemsComplete(params={}) {
    let items = []
    let list = []

    const op = await listItems()
    items = op.data

    list = await Promise.all(items.map(async (item) => {
        try {
            console.log('itemttt ', item.itemtype)
            const a = await getAllItems(item.itemtype,params)
           return a.data.map(x => ({
                ...x,
                item
                }))
        } catch (error) {
            console.error('Erreur chargement item:', error)

            return []
        }
    }))

    const c = {data:{items:[...items],list:[...list.flat()]}}
    console.log('çcccccc ',c)
    return c
}
export function getAllItems(item, params = {}) {
    return get(`${API_URL2}/Assets/${item}`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params)
}
export function getItem(item,idItem, params = {}) {
    return get(`${API_URL2}/Assets/${item}/${idItem}`, {
        Authorization: `Bearer ${getAccessToken()}`
    }, params)
}
export function createItem(item, data) {
    return post(`${API_URL2}/Assets/${item}`, data, {
        Authorization: `Bearer ${getAccessToken()}`
    })
}
export function updateItem(id,item, data) {
    return patch(`${API_URL2}/Assets/${item}/${id}`, data, {
        Authorization: `Bearer ${getAccessToken()}`
    })
}