<script setup>
import { onMounted, ref } from 'vue';
import { getAllCosts, getAllTicket } from '../../services/ticket';
import { getAllCoutSpring, getAllReouvertSpring } from '../../services/spring';

const liste = ref([]);

// ─────────────────────────────
// 1. FETCH DATA
// ─────────────────────────────
async function fetchTickets() {
    return (await getAllTicket()).data;
}

async function fetchAllCoutSpring() {
    return (await getAllCoutSpring()).data;
}

async function fetchAllReouv() {
    return (await getAllReouvertSpring()).data;
}

async function fetchCosts(ticketId) {
    return (await getAllCosts(ticketId)).data;
}

// ─────────────────────────────
// 2. CALCUL COSTS
// ─────────────────────────────
function calculateCost(costs) {
    return costs.reduce((sum, c) => {
        return sum + (((c.duration / 3600) * c.cost_time) + (c.cost_fixed ?? 0));
    }, 0);
}

function calculateCostSuper(allCoutSpring, ticketId) {
    return allCoutSpring
        .filter(c => c.idTicket == ticketId)
        .reduce((sum, c) => sum + (c.coutSuper ?? 0), 0);
}
function calulateSSS(allCoutSpring, ticketId) {
    return allCoutSpring
        .filter(c => c.idTicket == ticketId)
        .reduce((sum, c) => sum + (c.coutSuper ?? 0), 0);
}
// ─────────────────────────────
// 3. DISTRIBUTE COST BY ITEM
// ─────────────────────────────
function distributeCost(cost, costSuper,c, items) {
    const divider = items.length || 1;

    return items.map(item => ({
        key: item.itemtype,
        costPerItem: cost / divider,
        cPerItem: c / divider,
        costSuperPerItem: costSuper / divider
    }));
}

function distributeReouverture(reouvertue, items) {
    const divider = items.length || 1;

    return items.map(item => ({
        key: item.itemtype,
        reouverture: reouvertue / divider,
    }));
}
// ─────────────────────────────
// 4. AGGREGATION
// ─────────────────────────────
function aggregateByItem(map, distributed) {
    for (const d of distributed) {
        if (!map.has(d.key)) {
            map.set(d.key, {
                itemType: d.key,
                cost: 0,
                reouv: 0,
                costSuper: 0,
                total: 0
            });
        }

        const entry = map.get(d.key);

        entry.cost += d.costPerItem;
        entry.reouv += d.reouv;
        entry.costSuper += d.costSuperPerItem;
        entry.total += d.costPerItem + d.costSuperPerItem + d.reouv;
    }
}

// ─────────────────────────────
// MAIN
// ─────────────────────────────
onMounted(async () => {

    const tickets = await fetchTickets();
    const allCoutSpring = await fetchAllCoutSpring();
    const allCoutSpring1 = await fetchAllReouv();

    const map = new Map();

    for (const t of tickets) {

        const costs = await fetchCosts(t.id);

        const cost = calculateCost(costs);
        const costSuper = calculateCostSuper(allCoutSpring, t.id);
        const c = calulateSSS(allCoutSpring1, t.id)
        const items = t.items || [];

        const distributed = distributeCost(cost, costSuper,c, items);

        aggregateByItem(map, distributed);
    }

    liste.value = Array.from(map.values());
});
</script>
<template>
    <h2>Coûts par item type</h2>

    <table class="table">
        <thead>
            <tr>
                <th>Item type</th>
                <th>Cost</th>
                <th>Cost super</th>
                <th>Reouverture</th>
                <th>Total</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(value, index) in liste" :key="index">
                <td>{{ value.itemType }}</td>
                <td>{{ value.cost.toFixed(2) }}</td>
                <td>{{ value.reouv.toFixed(2) }}</td>
                <td>{{ value.costSuper.toFixed(2) }}</td>
                <td>{{ value.total.toFixed(2) }}</td>
            </tr>
        </tbody>
    </table>
</template>