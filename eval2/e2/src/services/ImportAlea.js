import Papa from 'papaparse'
import { createCoutSpring, deleteCoutSpring, getAllCoutByTicketSpring, getAllCoutByTicketSpringM, getAllCoutFirstSpring, getAllCoutFirstSpringM, getAllCoutLastSpring, getAllCoutLastSpringM, getAllCoutSpring, updateCoutSpring } from './spring'
import { getTicket } from './ticket'

export async function traiter(ticket, mvt, valeur = 0, mode = 1) {
    if (mvt == "open") {
        await createReouv(ticket, { idTicket: ticket, pourc: parseNumber(valeur) },mode)
        console.log("opeeennnn", parseNumber(valeur))
    } else if (mvt == "cancel") {
        console.log("cancellllll")
        await deleteCout(ticket)
    } else if (mvt == "close") {
        console.log("closeeee")
        await createCout(ticket, { idTicket: ticket, coutSuper: parseNumber(valeur) })
    }
} 
function somme(list) {
    let a = 0
    if (list.length >0) {
        for (const i of list) {
            // createCoutSpring({
            //     idTicket: formData.idTicket,
            //     groupe: (f),
                a+= (i.coutSuper)
                console.log("summmmer ",a)
                // itemType: i.itemType,
                // motif: "reouv"
        }
    }
    return a
}
function moyenne(list) {
    if (list.length >0) {
        return somme(list)/list.length
    } else {
        return 0
    }
}
async function createReouv(id, formData, mode = 1) {
    let lasts
    if (mode == 1) {
        lasts = (await getAllCoutLastSpring(id)).data.filter(a => a.motif == "cout")
    } else if (mode == 2) {
        lasts = (await getAllCoutFirstSpring(id)).data.filter(a => a.motif == "cout")
    } else if (mode == 3 || mode == 4) {
        lasts = (await getAllCoutByTicketSpring(id)).data
    }

    if (!lasts[0]) return

    let calcul = 0
    const f = lasts[0].groupe
    //test

    if (mode == 1 || mode == 2) {
        calcul = lasts[0].coutSuper * formData.pourc / 100
    } else if (mode == 3) {
        calcul = moyenne(lasts) * formData.pourc / 100
    } else if (mode == 4) {
        calcul = somme(lasts) * formData.pourc / 100
    }

    await createCoutSpring({
        idTicket: formData.idTicket,
        groupe: f,
        coutSuper: calcul,
        itemType: null,
        motif: "reouv",
        mode : mode,
        pourc : formData.pourc,
    })
}
async function updateReouv(idCout,id, formData, mode = 1) {
    let lasts
    if (mode == 1) {
        lasts = (await getAllCoutLastSpringM(id,idCout)).data.filter(a => a.motif == "cout")
    } else if (mode == 2) {
        lasts = (await getAllCoutFirstSpringM(id,idCout)).data.filter(a => a.motif == "cout")
    } else if (mode == 3 || mode == 4) {
        lasts = (await getAllCoutByTicketSpringM(id,idCout)).data
    }

    if (!lasts[0]) return

    let calcul = 0
    const f = lasts[0].groupe
    //test

    if (mode == 1 || mode == 2) {
        calcul = lasts[0].coutSuper * formData.pourc / 100
    } else if (mode == 3) {
        calcul = moyenne(lasts) * formData.pourc / 100
    } else if (mode == 4) {
        calcul = somme(lasts) * formData.pourc / 100
    }

    await updateCoutSpring({
        idTicket: formData.idTicket,
        groupe: f,
        coutSuper: calcul,
        itemType: null,
        motif: "reouv",
        mode : mode,
        pourc : formData.pourc,
    })
}
async function createCout(id, formData) {
    const s = (await getAllCoutSpring()).data
    let f = 0
    if (s[0]) {
        f = s[s.length - 1].groupe
    }
    // Une seule entrée, pas de split par item
    await createCoutSpring({ 
        idTicket: formData.idTicket, 
        groupe: (f + 1), 
        coutSuper: formData.coutSuper, 
        itemType: null,   // ou "ticket" selon ton modèle
        motif: "cout" 
    })
}

async function deleteCout(ticketId) {
    const all = (await getAllCoutLastSpring(ticketId)).data
    const couts = all.filter(p => p.motif == "cout")

    if (!couts.length) {
        alert("tsisy")
        return
    }

    for (const c of couts) {
        console.log("delteeeee")
        await deleteCoutSpring(c.id)
    }
}

function parseNumber(value) {
    if (value == null || value === '') return null
    const sanitized = String(value).trim().replace(',', '.')
    const num = Number(sanitized)
    return Number.isNaN(num) ? null : num
}

export async function importCSVAlea(csvText, useRef = true) {
    const refMap = {
        1: 1,
        2: 2,
        3: 3,
    }

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim().toLowerCase(),
    })

    const requiredColumns = ['ticket', 'mvt']
    const fieldSet = new Set(
        (parsed?.meta?.fields || []).map(x => x.trim().toLowerCase())
    )

    const missingColumns = requiredColumns.filter(col => !fieldSet.has(col))
    if (missingColumns.length) {
        throw new Error(`Colonnes manquantes: ${missingColumns.join(', ')}`)
    }

    for (const [rowIndex, row] of parsed.data.entries()) {
        const ticket = row.ticket?.trim()
        const mvt = row.mvt?.trim()
        const valeur = row.valeur?.trim()
        const mode = row.mode?.trim()

        const id = useRef ? refMap[ticket] : ticket

        if (useRef && !id) {
            console.warn(`Ref introuvable dans le map: ${ticket}`)
            continue
        }

        await traiter(id, mvt, parseNumber(valeur),parseNumber(mode))
    }
}