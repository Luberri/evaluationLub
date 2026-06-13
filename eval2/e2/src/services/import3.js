import Papa from 'papaparse'
import { createCost } from './ticket.js'

function normalizeHeader(header) {
    return String(header)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
}

function parseNumber(value) {
    if (value == null || value === '') return null
    const sanitized = String(value).trim().replace(',', '.')
    const num = Number(sanitized)
    return Number.isNaN(num) ? null : num
}

function resolveTicketId(rawTicket, importedTicket = []) {
    const ticketKey = String(rawTicket ?? '').trim()
    if (!ticketKey) return null

    const found = importedTicket.find(row => String(row.ref) === ticketKey || String(row.ticketId) === ticketKey)
    if (found) {
        return found.ticketId
    }

    const numeric = Number(ticketKey)
    return Number.isNaN(numeric) ? null : numeric
}

/**
 * Importe des coûts de ticket depuis un CSV.
 * Colonnes attendues : Num_Ticket, Duration_second, Time_Cost, Fixed_Cost
 */
export async function importCostsCV(csvText, importedTicket = []) {
    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: normalizeHeader,
    })

    const requiredColumns = ['num_ticket', 'duration_second', 'time_cost', 'fixed_cost']
    const fieldSet = new Set(parsed?.meta?.fields ?? [])
    const missing = requiredColumns.filter(column => !fieldSet.has(column))
    if (missing.length) {
        throw new Error(`Colonnes manquantes : ${missing.join(', ')}`)
    }

    const results = []
    const now = new Date().toISOString()

    for (const [index, row] of parsed.data.entries()) {
        const ticketRef = String(row.num_ticket ?? '').trim()
        const duration = parseNumber(row.duration_second)
        const costTime = parseNumber(row.time_cost)
        const costFixed = parseNumber(row.fixed_cost)

        // Vérification du ref ticket
        if (!ticketRef) {
            throw new Error(`CSV 3 Ligne ${index + 2}: Ref Ticket manquant ou vide`)
        }

        // Vérification des champs numériques
        const fieldErrors = []
        // if (duration === null) fieldErrors.push('Duration_second')
        // if (costTime === null) fieldErrors.push('Time_cost')
        // if (costFixed === null) fieldErrors.push('Fixed_cost')

        // if (fieldErrors.length > 0) {
        //     throw new Error(`CSV 3 Ligne ${index + 2}: Champs numériques invalides: ${fieldErrors.join(', ')}`)
        // }

        const ticketId = resolveTicketId(ticketRef, importedTicket)
        if (!ticketId) {
            throw new Error(`CSV 3 Ligne ${index + 2}: Ticket introuvable pour Num_Ticket="${ticketRef}"`)
        }

        const rowResult = {
            ticketRef,
            ticketId,
            payload: {
                name: `cost ${index + 1}`,
                comment: 'cost',
                date_begin: now,
                date_end: now,
                duration,
                cost_time: costTime,
                cost_fixed: costFixed,
            },
            success: false,
            error: null,
        }

        try {
            const response = await createCost(ticketId, rowResult.payload)
            rowResult.success = true
            rowResult.response = response?.data
        } catch (err) {
            throw new Error(`CSV 3 Ligne ${index + 2}: Création de coût échouée - ${err?.response?.data || err?.message || 'Erreur inconnue'}`)
        }

        results.push(rowResult)
    }

    return results
}
