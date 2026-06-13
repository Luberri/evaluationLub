import Papa from 'papaparse'
import { get, post, patch, API_URL1,API_URL2, APP_TOKEN, getSession } from '../util.js'
import { addTicketItem, getTicket, updateTicket } from './ticket.js'

// ─────────────────────────────────────────────
// HELPER — headers v1
// ─────────────────────────────────────────────

function v1Headers() {
    return {
        "Session-Token": getSession(),
        "App-Token": APP_TOKEN
    }
}

// ─────────────────────────────────────────────
// MAPPINGS — enums GLPI
// ─────────────────────────────────────────────

const TICKET_TYPE_MAP = {
    'incident': 1,
    'request': 2,
    'demande': 2,
}

const TICKET_STATUS_MAP = {
    'new': 1,
    'nouveau': 1,
    'processing': 2,
    'processing(assigned)': 2,
    'in progress (assigned)': 2,
    'en cours': 2,
    'processing(planned)': 3,
    'planifié': 3,
    'pending': 4,
    'en attente': 4,
    'solved': 5,
    'résolu': 5,
    'closed': 6,
    'fermé': 6,
    'clos': 6,
}

const TICKET_PRIORITY_MAP = {
    'very low': 1,
    'très basse': 1,
    'low': 2,
    'basse': 2,
    'medium': 3,
    'moyenne': 3,
    'normal': 3,
    'high': 4,
    'haute': 4,
    'very high': 5,
    'très haute': 5,
    'major': 6,
    'majeure': 6,
}

function csvError(rowNumber, message) {
    return new Error(`CSV 2 ligne ${rowNumber-1}: ${message}`)
}

// ─────────────────────────────────────────────
// HELPER — résolution d'enum (insensible à la casse)
// ─────────────────────────────────────────────

function resolveEnum(map, value, fieldName, rowNumber) {
    if (!value) {
        throw csvError(rowNumber, `${fieldName} manquant ou vide`)
    }

    const key = value.trim().toLowerCase()
    if (key in map) return map[key]

    const num = parseInt(value, 10)
    if (!isNaN(num)) return num

    throw csvError(rowNumber, `Valeur inconnue pour ${fieldName}: "${value}"`)
}

// ─────────────────────────────────────────────
// HELPER — date "DD/MM/YYYY" + "HH:MM" → "YYYY-MM-DD HH:MM:SS"
// ─────────────────────────────────────────────

function parseGlpiDate(dateStr, timeStr = '00:00') {
    if (!dateStr) return null
    let day, month, year
    if (dateStr.includes('/')) {
        ;[day, month, year] = dateStr.split('/')
    } else {
        ;[year, month, day] = dateStr.split('-')
    }
    const time = timeStr.includes(':') ? timeStr : '00:00'
    const seconds = time.split(':').length === 2 ? `${time}:00` : time
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${seconds}`
}

// ─────────────────────────────────────────────
// HELPER — parse du champ Items
// ─────────────────────────────────────────────

function parseItemsField(raw) {
    if (!raw) return []
    const trimmed = raw.trim()
    if (!trimmed) return []
    if (trimmed.startsWith('[')) {
        try {
            return JSON.parse(trimmed).map(s => String(s).trim()).filter(Boolean)
        } catch {
            return trimmed
                .replace(/^\[|\]$/g, '')
                .split(',')
                .map(s => s.replace(/^"|"$/g, '').trim())
                .filter(Boolean)
        }
    }
    return [trimmed]
}

// ─────────────────────────────────────────────
// CORE — création ticket
// ─────────────────────────────────────────────

async function createTicket(ticketData) {
    return post(`${API_URL1}/Ticket`, { input: ticketData }, v1Headers())
}

// ─────────────────────────────────────────────
// CORE — liaison asset → ticket
// ─────────────────────────────────────────────

async function linkItemToTicket(ticketId, itemtype, itemId) {
    console.log(`Ticket ${ticketId} mis à jour avec item ${itemtype} #${itemId}`)
    return addTicketItem(ticketId, { items_id: itemId, itemtype })
}

// ─────────────────────────────────────────────
// BATCH — traitement d'une ligne
// ─────────────────────────────────────────────

async function processRow(row, assetMap, rowIndex) {
    const ref = row.ref_ticket?.trim()
    const dateStr = row.date?.trim()
    const heureStr = row.heure?.trim()
    const typeRaw = row.type?.trim()
    const titre = row.titre?.trim()
    const description = row.description?.trim()
    const statusRaw = row.status?.trim()
    const priorityRaw = row.priority?.trim()
    const itemsRaw = row.items?.trim()

    const rowResult = { ref, ticketId: null, linkedItems: [], errors: [] }

    // ── Validation stricte des champs requis ────────────────
    const errors = []
    if (!ref) errors.push('ref_ticket')
    if (!dateStr) errors.push('date')
    if (!heureStr) errors.push('heure')
    if (!typeRaw) errors.push('type')
    if (!titre) errors.push('titre')
    if (!description) errors.push('description')
    if (!statusRaw) errors.push('status')
    if (!priorityRaw) errors.push('priority')

    if (errors.length > 0) {
        throw new Error(` CSV 2 Ligne ${rowIndex + 2}: Champs manquants ou vides: ${errors.join(', ')}`)
    }

    // ── Résolution des enums ────────────────────────────────
    let typeId, statusId, priorityId
    try {
        typeId = resolveEnum(TICKET_TYPE_MAP, typeRaw, 'Type', rowIndex + 2)
        statusId = resolveEnum(TICKET_STATUS_MAP, statusRaw, 'Status', rowIndex + 2)
        priorityId = resolveEnum(TICKET_PRIORITY_MAP, priorityRaw, 'Priority', rowIndex + 2)
    } catch (err) {
        throw err
    }

    // ── Construction du payload ─────────────────────────────
    const ticketData = {
        name: titre,
        content: description,
        type: typeId,
        status: statusId,
        priority: priorityId,
    }

    const glpiDate = parseGlpiDate(dateStr, heureStr)
    if (!glpiDate) {
        throw new Error(`CSV 2 Ligne ${rowIndex + 2}: Format date/heure invalide - date: "${dateStr}", heure: "${heureStr}"`)
    }
    ticketData.date = glpiDate

    // ── Création du ticket ──────────────────────────────────
    let ticketId
    try {
        const res = await createTicket(ticketData)
        ticketId = res?.data?.id
        if (!ticketId) throw new Error(`Réponse inattendue : ${JSON.stringify(res?.data)}`)
        rowResult.ticketId = ticketId
    } catch (err) {
        throw new Error(`CSV 2 Ligne ${rowIndex + 2}: Création ticket échouée - ${err.message}`)
    }

    // ── Liaison des assets ──────────────────────────────────
    if (itemsRaw && itemsRaw !== '[]') {
        const assetNames = [...new Set(parseItemsField(itemsRaw))] // déduplique
        for (const assetName of assetNames) {                      // séquentiel ← fix
            const asset = assetMap.get(assetName)
            if (!asset) {
                throw new Error(`CSV 2 Ligne ${rowIndex + 2}: Asset introuvable : "${assetName}"`)
            }
            const itemtype = asset.itemtype || 'Computer'
            try {
                await linkItemToTicket(ticketId, itemtype, asset.id)
                rowResult.linkedItems.push({ name: assetName, itemtype, id: asset.id })
            } catch (err) {
                // throw new Error(`CSV 2 Ligne ${rowIndex + 2}: Liaison asset "${assetName}" échouée - ${err.message}`)
            }
        }
    }

    return rowResult
}

// ─────────────────────────────────────────────
// EXPORT PRINCIPAL
// ─────────────────────────────────────────────

export async function importTicketsCSV(csvText, importedAssets = []) {
    const assetMap = new Map(importedAssets.map(a => [a.name, a]))

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toLowerCase(),
    })

    const requiredColumns = ['ref_ticket', 'date', 'heure', 'type', 'titre', 'description', 'status', 'priority']
    const fieldSet = new Set(parsed?.meta?.fields ?? [])
    const missing = requiredColumns.filter(c => !fieldSet.has(c))

    if (missing.length) {
        throw new Error(`Colonnes manquantes : ${missing.join(', ')}`)
    }

    const BATCH_SIZE = 5
    const results = []

    for (let i = 0; i < parsed.data.length; i += BATCH_SIZE) {
        const batch = parsed.data.slice(i, i + BATCH_SIZE)
        const batchResults = await Promise.all(
            batch.map((row, batchIdx) => processRow(row, assetMap, i + batchIdx))
        )
        results.push(...batchResults)
    }

    return results
}