
<script setup>
import { onMounted, ref } from 'vue';
import { getAllCoutSpring, detailSpring } from '../../services/spring';
import { getAllCosts, getAllTicket } from '../../services/ticket';
import { listItems } from '../../services/item';
import { formatNumber } from '../../util';
import { VueFinalModal } from 'vue-final-modal';

const rs = ref([])
const showDetail = ref(false)
const detailRows = ref([])
const avecCost = ref([])
const totalDetail = ref(0)
const totalMax = ref(0)

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

    const ticketsConcernes = avecCost.value.filter(t =>
        t.items.some(i => i.itemtype === r.itemType)
    )

    for (const t of ticketsConcernes) {
        const nbItems = t.items.length || 1
        const coutGlpiTotal = getCoutGlpi(t.coutGlpi)

        detailRows.value.push({
            idTicket: t.id,
            motif: 'glpi',
            coutSuper: coutGlpiTotal / nbItems
        })

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

    rs.value = Object.values(parItemType)
    for (const element of rs.value) {
        totalMax.value+=element.coutTotal
    }
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
            <tr><th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>{{formatNumber(totalMax,3,3) }}</th></tr>
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