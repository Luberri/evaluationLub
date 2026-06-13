import Papa from 'papaparse'
import { get, post, API_URL1, APP_TOKEN, getSession } from '../util.js'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function v1Headers() {
    return {
        'Session-Token': getSession(),
        'App-Token': APP_TOKEN
    }
}

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

export function getAllStatesV1(params = {}) {
    return get(`${API_URL1}/State`, v1Headers(), params)
}

export function createStateV1(data) {
    return post(`${API_URL1}/State`, { input: data }, v1Headers())
}

export function getAllLocationsV1(params = {}) {
    return get(`${API_URL1}/Location`, v1Headers(), params)
}

export function createLocationV1(data) {
    return post(`${API_URL1}/Location`, { input: data }, v1Headers())
}

export function getAllManufacturersV1(params = {}) {
    return get(`${API_URL1}/Manufacturer`, v1Headers(), params)
}

export function createManufacturerV1(data) {
    return post(`${API_URL1}/Manufacturer`, { input: data }, v1Headers())
}

export function getAllUsersV1(params = {}) {
    return get(`${API_URL1}/User`, v1Headers(), params)
}

export function createUserV1(data) {
    return post(`${API_URL1}/User`, { input: data }, v1Headers())
}

export function getAllItemTypesV1(item, params = {}) {
    return get(`${API_URL1}/${item}Type`, v1Headers(), params)
}

export function createItemTypeV1(item, data) {
    return post(`${API_URL1}/${item}Type`, { input: data }, v1Headers())
}

export function getAllItemModelsV1(item, params = {}) {
    return get(`${API_URL1}/${item}Model`, v1Headers(), params)
}

export function createItemModelV1(item, data) {
    return post(`${API_URL1}/${item}Model`, { input: data }, v1Headers())
}

export function createItemV1(item, data) {
    return post(`${API_URL1}/${item}`, { input: data }, v1Headers())
}

// ─────────────────────────────────────────────
// IMPORT CSV
// ─────────────────────────────────────────────

export async function importCSV(csvText, ticket = {}) {
    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim().toLowerCase(),
    })

    const requiredColumns = [
        'name',
        'status',
        'location',
        'manufacturer',
        'item_type',
        'model',
        'inventory_number',
        'user'
    ]

    const fieldSet = new Set(
        (parsed?.meta?.fields || [])
            .map(x => x.trim().toLowerCase())
    )

    const missingColumns = requiredColumns.filter(
        col => !fieldSet.has(col)
    )

    if (missingColumns.length) {
        throw new Error(
            `Colonnes manquantes: ${missingColumns.join(', ')}`
        )
    }

    // ─────────────────────────────────────────
    // CACHE GLOBAL
    // ─────────────────────────────────────────

    const stateCache = new Map()
    const locationCache = new Map()
    const manufacturerCache = new Map()
    const userCache = new Map()

    const itemTypeCache = new Map()
    const modelCache = new Map()

    // ─────────────────────────────────────────
    // CHARGEMENT INITIAL
    // ─────────────────────────────────────────

    ;(await getAllStatesV1()).data.forEach(x =>
        stateCache.set(x.name, x)
    )

    ;(await getAllLocationsV1()).data.forEach(x =>
        locationCache.set(x.name, x)
    )

    ;(await getAllManufacturersV1()).data.forEach(x =>
        manufacturerCache.set(x.name, x)
    )

    ;(await getAllUsersV1()).data.forEach(x =>
        userCache.set(x.name, x)
    )

    // ─────────────────────────────────────────
    // HELPERS CACHE TYPE/MODEL
    // ─────────────────────────────────────────

    async function loadItemTypeCache(itemType) {
        if (itemTypeCache.has(itemType))
            return

        const data = (await getAllItemTypesV1(itemType)).data

        itemTypeCache.set(
            itemType,
            new Map(data.map(x => [x.name, x]))
        )
    }

    async function loadModelCache(itemType) {
        if (modelCache.has(itemType))
            return

        const data = (await getAllItemModelsV1(itemType)).data

        modelCache.set(
            itemType,
            new Map(data.map(x => [x.name, x]))
        )
    }

    // ─────────────────────────────────────────
    // RESULTAT
    // ─────────────────────────────────────────

    const createdAssets = []

    // ─────────────────────────────────────────
    // TRAITEMENT CSV
    // ─────────────────────────────────────────

    for (const [rowIndex, row] of parsed.data.entries()) {
        const name = row.name?.trim()
        const status = row.status?.trim()
        const location = row.location?.trim()
        const manufacturer = row.manufacturer?.trim()
        const item_type = row.item_type?.trim()
        const model = row.model?.trim()
        const inventory_number = row.inventory_number?.trim()
        const user = row.user?.trim() ?? ''

        // Validation stricte des champs requis
        const errors = []
        if (!name) errors.push('name')
        // if (!status) errors.push('status')
        // if (!location) errors.push('location')
        // if (!manufacturer) errors.push('manufacturer')
        // if (!item_type) errors.push('item_type')
        // if (!inventory_number) errors.push('inventory_number')

        if (errors.length > 0) {
            throw new Error(`CSV 1 Ligne ${rowIndex + 2}: Champs manquants ou vides: ${errors.join(', ')}`)
        }

        await loadItemTypeCache(item_type)
        await loadModelCache(item_type)

        // ─────────────────────────────────────
        // STATE
        // ─────────────────────────────────────

        let stateObj = stateCache.get(status)

        if (!stateObj) {
            const res = await createStateV1({
                name: status,
                comment: status,
                is_recursive: true,
                is_visible_helpdesk: true
            })

            stateObj = {
                id: res.data.id,
                name: status
            }

            stateCache.set(status, stateObj)
        }

        // ─────────────────────────────────────
        // LOCATION
        // ─────────────────────────────────────

        let locationObj = locationCache.get(location)

        if (!locationObj) {
            const res = await createLocationV1({
                name: location,
                comment: location
            })

            locationObj = {
                id: res.data.id,
                name: location
            }
            locationCache.set(location, locationObj)
        }

        // ─────────────────────────────────────
        // MANUFACTURER
        // ─────────────────────────────────────

        let manufacturerObj =
            manufacturerCache.get(manufacturer)

        if (!manufacturerObj) {
            const res = await createManufacturerV1({
                name: manufacturer,
                comment: manufacturer
            })

            manufacturerObj = {
                id: res.data.id,
                name: manufacturer
            }

            manufacturerCache.set(
                manufacturer,
                manufacturerObj
            )
        }

        // ─────────────────────────────────────
        // ITEM TYPE
        // ─────────────────────────────────────

        let itemTypeObj =
            itemTypeCache.get(item_type).get(item_type)

        if (!itemTypeObj) {
            const res = await createItemTypeV1(item_type, {
                name: item_type,
                comment: item_type
            })

            itemTypeObj = {
                id: res.data.id,
                name: item_type
            }

            itemTypeCache
                .get(item_type)
                .set(item_type, itemTypeObj)
        }

        // ─────────────────────────────────────
        // MODEL
        // ─────────────────────────────────────

        let modelObj =
            modelCache.get(item_type).get(model)

        if (!modelObj) {
            const res = await createItemModelV1(item_type, {
                name: model,
                comment: model
            })

            modelObj = {
                id: res.data.id,
                name: model
            }

            modelCache
                .get(item_type)
                .set(model, modelObj)
        }

        // ─────────────────────────────────────
        // USER
        // ─────────────────────────────────────

        let userObj = null

        if (user) {
            userObj = userCache.get(user)

            if (!userObj) {
                const res = await createUserV1({
                    name: user,
                    realname: user,
                    firstname: user,
                    email: `${user}@example.com`,
                    password: user,
                    password2: user
                })

                userObj = {
                    id: res.data.id,
                    name: user
                }

                userCache.set(user, userObj)
            }
        }

        // ─────────────────────────────────────
        // ASSET
        // ─────────────────────────────────────

        const itemData = {
            name,
            states_id: stateObj.id,
            locations_id: locationObj.id,
            manufacturers_id: manufacturerObj.id,
            [`${item_type.toLowerCase()}types_id`]: itemTypeObj.id,
            [`${item_type.toLowerCase()}models_id`]: modelObj.id,
            otherserial: inventory_number
        }

        if (userObj) {
            itemData.users_id = userObj.id
        }

        const createdAsset =
            await createItemV1(item_type, itemData)

        createdAssets.push({
            id: createdAsset?.data?.id,
            name,
            item_type,
            inventory_number,
            status,
            location,
            manufacturer,
            model,
            user
        })
    }

    return createdAssets.map(item => ({
        id: item.id,
        name: item.name,
        itemtype: item.item_type
    }))
}