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
    totalMax.value = rs.value.reduce((s, e) => s + (e.coutTotal || 0), 0)
})
</script>

<template>
    <div class="page">
        <div class="page-header">
            <span class="page-count">{{ rs.length }} types d'éléments</span>
            <h1>Coûts par type d'élément</h1>
        </div>

        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Élément</th>
                        <th class="col-num">Coût GLPI</th>
                        <th class="col-num">Coût super</th>
                        <th class="col-num">Réouverture</th>
                        <th class="col-num">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in rs" :key="r.itemType" class="row-clickable" @click="aff(r)">
                        <td class="cell-item">
                            <span class="item-name">{{ r.itemType }}</span>
                            <i class="ti ti-chevron-right row-arrow" aria-hidden="true"></i>
                        </td>
                        <td class="col-num">{{ formatNumber(r.coutGlpi) }}</td>
                        <td class="col-num">{{ formatNumber(r.coutSuper) }}</td>
                        <td class="col-num">{{ formatNumber(r.coutReouv) }}</td>
                        <td class="col-num col-total">{{ formatNumber(r.coutTotal) }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td class="foot-label">Total général</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="col-num foot-total">{{ formatNumber(totalMax, 3, 3) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

    <VueFinalModal v-model="showDetail">
        <div class="modal-overlay" @click.self="showDetail = false">
            <div class="modal-box">

                <div class="modal-head">
                    <div>
                        <p class="modal-sup">Détail</p>
                        <h2>Répartition par ticket</h2>
                    </div>
                    <button class="modal-close" @click="showDetail = false" aria-label="Fermer">
                        <i class="ti ti-x" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="detail-list">
                        <div v-for="(d, idx) in detailRows" :key="idx" class="detail-row">
                            <span class="detail-ticket">#{{ d.idTicket }}</span>
                            <span class="detail-motif">
                                <span class="badge" :class="d.motif === 'glpi' ? 'badge--light' : d.motif === 'reouv' ? 'badge--dark' : 'badge--mid'">
                                    {{ d.motif }}
                                </span>
                            </span>
                            <span class="detail-cout">{{ formatNumber(d.coutSuper) }}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-foot">
                    <span class="foot-label">Total</span>
                    <span class="foot-total">{{ formatNumber(totalDetail) }}</span>
                </div>

            </div>
        </div>
    </VueFinalModal>
</template>

<style scoped>
.page {
    padding: 32px 36px;
    max-width: 900px;
}

.page-header {
    margin-bottom: 24px;
}

h1 {
    font-size: 20px;
    font-weight: 500;
    color: #0a0a0a;
    letter-spacing: -0.3px;
    margin: 0;
}

.page-count {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 4px;
}

/* ── Table ───────────────────────────────── */
.table-wrap {
    border: 0.5px solid #e5e5e5;
    border-radius: 2px;
    overflow: hidden;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    font-size: 13px;
}

thead {
    background: #f7f7f5;
    border-bottom: 0.5px solid #e5e5e5;
}

th {
    padding: 10px 16px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #999;
    text-align: left;
}

td {
    padding: 11px 16px;
    border-bottom: 0.5px solid #f0f0f0;
    color: #0a0a0a;
    vertical-align: middle;
}

.col-num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: #555;
}

.col-total {
    color: #0a0a0a;
    font-weight: 500;
}

/* ── Clickable row ───────────────────────── */
.row-clickable {
    cursor: pointer;
    transition: background 0.1s;
}

.row-clickable:hover {
    background: #f7f7f5;
}

.row-clickable:hover .row-arrow {
    opacity: 1;
    transform: translateX(2px);
}

.cell-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.item-name {
    flex: 1;
}

.row-arrow {
    font-size: 13px;
    color: #bbb;
    opacity: 0;
    transition: opacity 0.1s, transform 0.1s;
}

/* ── Tfoot ───────────────────────────────── */
tfoot tr td {
    border-bottom: none;
    border-top: 0.5px solid #e5e5e5;
    background: #f7f7f5;
}

.foot-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #999;
}

.foot-total {
    font-size: 14px;
    font-weight: 600;
    color: #0a0a0a !important;
}

/* ── Modal overlay ───────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-box {
    background: #fff;
    border-radius: 2px;
    width: 560px;
    max-width: 92vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ── Modal head ──────────────────────────── */
.modal-head {
    padding: 18px 20px;
    border-bottom: 0.5px solid #e5e5e5;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-shrink: 0;
}

.modal-sup {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 3px;
}

.modal-head h2 {
    font-size: 15px;
    font-weight: 500;
    color: #0a0a0a;
    margin: 0;
}

.modal-close {
    background: none;
    border: 0.5px solid #e5e5e5;
    border-radius: 2px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #999;
    flex-shrink: 0;
    transition: color 0.1s, background 0.1s;
}

.modal-close:hover {
    background: #0a0a0a;
    color: #fff;
    border-color: #0a0a0a;
}

.modal-close i { font-size: 14px; }

/* ── Modal body ──────────────────────────── */
.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
}

.detail-list {
    display: flex;
    flex-direction: column;
}

.detail-row {
    display: grid;
    grid-template-columns: 80px 1fr 1fr;
    align-items: center;
    padding: 9px 20px;
    border-bottom: 0.5px solid #f5f5f5;
    transition: background 0.1s;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-row:hover {
    background: #fafafa;
}

.detail-ticket {
    font-size: 12px;
    font-weight: 600;
    color: #0a0a0a;
    font-variant-numeric: tabular-nums;
}

.badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 2px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
}

.badge--dark  { background: #0a0a0a; color: #fff; }
.badge--light { background: #f0f0f0; color: #666; }
.badge--mid   { background: #e5e5e5; color: #444; }

.detail-cout {
    text-align: right;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: #555;
}

/* ── Modal foot ──────────────────────────── */
.modal-foot {
    padding: 14px 20px;
    border-top: 0.5px solid #e5e5e5;
    background: #f7f7f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.modal-foot .foot-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #999;
}

.modal-foot .foot-total {
    font-size: 15px;
    font-weight: 600;
    color: #0a0a0a;
}
</style>