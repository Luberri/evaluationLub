<!-- <script setup>
import { onMounted, ref } from 'vue';
import { getAllCoutSpring, detailSpring } from '../../services/spring';
import { getAllCosts, getAllTicket } from '../../services/ticket';
import { listItems } from '../../services/item';
import { formatNumber } from '../../util';
import { VueFinalModal } from 'vue-final-modal';

const rs = ref([])
const showDetail = ref(false)
const detailGlpi = ref([])
const detailSuper = ref([])
const avecCost = ref([])
const total = ref(0)

function getCoutGlpi(coutGlpi) {
    let total = 0
    for (const c of coutGlpi) {
        total += (c.duration / 3600) * c.cost_time + c.cost_fixed
    }
    return total
}

async function aff(r) {
    const springDetail = (await detailSpring(r.itemType)).data

    detailSuper.value = springDetail

    const ticketsConcernes = avecCost.value.filter(t =>
        t.items.some(i => i.itemtype === r.itemType)
    )
    detailGlpi.value = ticketsConcernes.map(t => {
        const nbItems = t.items.length || 1
        const coutGlpiTotal = getCoutGlpi(t.coutGlpi)
        const glpiReparti = coutGlpiTotal / nbItems
        return { idTicket: t.id, itemType: r.itemType, coutGlpiReparti: glpiReparti }
    })

    for (const e of detailSuper.value) {
        total.value += e.coutSuper
        console.log("111111 ",e.coutSuper)
    }
    for (const e of detailGlpi.value) {
        total.value += e.coutGlpiReparti
        console.log("2222 ",e.coutGlpiReparti)
    }
    showDetail.value = true
}

onMounted(async () => {
    const tickets = (await getAllTicket()).data
    const allCoutsSpring = (await getAllCoutSpring()).data

    avecCost.value = await Promise.all(tickets.map(async (t) => {
        const a = allCoutsSpring.filter(c => c.idTicket == t.id && c.motif != "reouv")
        const b = allCoutsSpring.filter(c => c.idTicket == t.id && c.motif == "reouv")
        const a1 = (await getAllCosts(t.id)).data
        return { ...t, coutSuper: a, coutGlpi: a1, reouv: b }
    }))

    const itemsType = (await listItems()).data

    const parItemType = avecCost.value.reduce((acc, t) => {
        const coutGlpiTotal = getCoutGlpi(t.coutGlpi)
        const nbItems = t.items.length

        for (const i of t.items) {
            const key = i.itemtype
            if (!acc[key]) {
                acc[key] = { itemType: key, coutGlpi: 0, coutSuper: 0, coutReouv: 0, coutTotal: 0 }
            }

            const glpiReparti = coutGlpiTotal / nbItems

            const superPourCetItem = t.coutSuper
                .filter(c => c.itemType === key)
                .reduce((s, c) => s + c.coutSuper, 0)

            const reouvPourCetItem = t.reouv
                .filter(c => c.itemType === key)
                .reduce((s, c) => s + c.coutSuper, 0)

            acc[key].coutGlpi += glpiReparti
            acc[key].coutSuper += superPourCetItem
            acc[key].coutReouv += reouvPourCetItem
            acc[key].coutTotal += glpiReparti + superPourCetItem + reouvPourCetItem
        }

        for (const eee of itemsType) {
            const aa = eee.itemtype
            if (!acc[aa]) {
                acc[aa] = { itemType: aa, coutGlpi: 0, coutSuper: 0, coutReouv: 0, coutTotal: 0 }
            }
        }

        return acc
    }, {})

    rs.value = Object.values(parItemType)
})
</script>

<template>
    <h1>gogogogog</h1>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>item</th>
                <th>cout</th>
                <th>super cout</th>
                <th>reouverture cout</th>
                <th>total</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="r in rs" @click="aff(r)" style="cursor:pointer">
                <td>{{ r.itemType }}</td>
                <td>{{ formatNumber(r.coutGlpi) }}</td>
                <td>{{ formatNumber(r.coutSuper) }}</td>
                <td>{{ formatNumber(r.coutReouv) }}</td>
                <td>{{ formatNumber(r.coutTotal) }}</td>
            </tr>
        </tbody>
    </table>

    <VueFinalModal v-model="showDetail">
        <div class="modal d-block" tabindex="-1">
            <div class="modal-dialog" style="max-width: 90vw;">
                <div class="modal-content p-3">
                    <div class="modal-header">
                        <h5 class="modal-title">Détail</h5>
                        <button type="button" class="btn-close" @click="showDetail = false"></button>
                    </div>
                    <div class="modal-body">

                        <h6>Cout GLPI</h6>
                        <table class="table table-striped mb-4">
                            <thead>
                                <tr>
                                    <th>Ticket</th>
                                    <th>Item Type</th>
                                    <th>Cout GLPI</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="g in detailGlpi" :key="g.idTicket">
                                    <td>{{ g.idTicket }}</td>
                                    <td>{{ g.itemType }}</td>
                                    <td>{{ formatNumber(g.coutGlpiReparti) }}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h6>Cout Super</h6>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Ticket</th>
                                    <th>Item Type</th>
                                    <th>Cout Super</th>
                                    <th>Motif</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="s in detailSuper" :key="s.id">
                                    <td>{{ s.idTicket }}</td>
                                    <td>{{ s.itemType }}</td>
                                    <td>{{ formatNumber(s.coutSuper) }}</td>
                                    <td>{{ s.motif }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h3>Total : {{ total }}</h3>
                    </div>
                </div>
            </div>
        </div>
    </VueFinalModal>
</template> -->


<script setup>
import { onMounted, ref } from 'vue';
import { getAllCoutSpring, detailSpring } from '../../services/spring';
import { getAllCosts, getAllTicket } from '../../services/ticket';
import { listItems } from '../../services/item';
import { formatNumber } from '../../util';
import { VueFinalModal } from 'vue-final-modal';

const rs = ref([])
const showDetail = ref(false)
const detailRows = ref([])  // { idTicket, motif, coutSuper, nbItems }
const avecCost = ref([])
const totalDetail = ref(0)

function getCoutGlpi(coutGlpi) {
    let total = 0
    for (const c of coutGlpi) {
        total += (c.duration / 3600) * c.cost_time + c.cost_fixed
    }
    return total
}

async function aff(r) {
    totalDetail.value = 0
    detailRows.value = []

    // Tickets qui ont cet itemType
    const ticketsConcernes = avecCost.value.filter(t =>
        t.items.some(i => i.itemtype === r.itemType)
    )

    for (const t of ticketsConcernes) {
        const nbItems = t.items.length || 1
        const coutGlpiTotal = getCoutGlpi(t.coutGlpi)

        // GLPI réparti
        detailRows.value.push({
            idTicket: t.id,
            motif: 'glpi',
            coutSuper: coutGlpiTotal / nbItems
        })

        // couts spring (cout + reouv) divisés par nbItems
        for (const c of [...t.coutSuper, ...t.reouv]) {
            detailRows.value.push({
                idTicket: t.id,
                motif: c.motif,
                coutSuper: c.coutSuper / nbItems
            })
        }
    }

    totalDetail.value = detailRows.value.reduce((s, r) => s + r.coutSuper, 0)
    showDetail.value = true
}

onMounted(async () => {
    const tickets = (await getAllTicket()).data
    const allCoutsSpring = (await getAllCoutSpring()).data

    avecCost.value = await Promise.all(tickets.map(async (t) => {
        const coutSuper = allCoutsSpring.filter(c => c.idTicket == t.id && c.motif == "cout")
        const reouv = allCoutsSpring.filter(c => c.idTicket == t.id && c.motif == "reouv")
        const coutGlpi = (await getAllCosts(t.id)).data
        return { ...t, coutSuper, coutGlpi, reouv }
    }))

    const itemsType = (await listItems()).data

    const parItemType = avecCost.value.reduce((acc, t) => {
        const nbItems = t.items.length || 1
        const coutGlpiTotal = getCoutGlpi(t.coutGlpi)
        const superTotal = t.coutSuper.reduce((s, c) => s + c.coutSuper, 0)
        const reouvTotal = t.reouv.reduce((s, c) => s + c.coutSuper, 0)

        for (const i of t.items) {
            const key = i.itemtype
            if (!acc[key]) {
                acc[key] = { itemType: key, coutGlpi: 0, coutSuper: 0, coutReouv: 0, coutTotal: 0 }
            }
            acc[key].coutGlpi += coutGlpiTotal / nbItems
            acc[key].coutSuper += superTotal / nbItems
            acc[key].coutReouv += reouvTotal / nbItems
            acc[key].coutTotal += (coutGlpiTotal + superTotal + reouvTotal) / nbItems
        }
        return acc
    }, {})

    // items sans tickets
    for (const eee of itemsType) {
        const key = eee.itemtype
        if (!parItemType[key]) {
            parItemType[key] = { itemType: key, coutGlpi: 0, coutSuper: 0, coutReouv: 0, coutTotal: 0 }
        }
    }

    rs.value = Object.values(parItemType)
})
</script>

<template>
    <h1>gogogogog</h1>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>item</th>
                <th>cout</th>
                <th>super cout</th>
                <th>reouverture cout</th>
                <th>total</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="r in rs" :key="r.itemType" @click="aff(r)" style="cursor:pointer">
                <td>{{ r.itemType }}</td>
                <td>{{ r.coutGlpi }}</td>
                <td>{{ r.coutSuper }}</td>
                <td>{{ r.coutReouv }}</td>
                <td>{{ r.coutTotal }}</td>
            </tr>
        </tbody>
    </table>

    <VueFinalModal v-model="showDetail">
        <div class="modal d-block" tabindex="-1">
            <div class="modal-dialog" style="max-width: 90vw;">
                <div class="modal-content p-3">
                    <div class="modal-header">
                        <h5 class="modal-title">Détail</h5>
                        <button type="button" class="btn-close" @click="showDetail = false"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Ticket</th>
                                    <th>Motif</th>
                                    <th>Cout (réparti)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(d, idx) in detailRows" :key="idx">
                                    <td>{{ d.idTicket }}</td>
                                    <td>{{ d.motif }}</td>
                                    <td>{{ formatNumber(d.coutSuper) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h3>Total : {{ formatNumber(totalDetail) }}</h3>
                    </div>
                </div>
            </div>
        </div>
    </VueFinalModal>
</template>