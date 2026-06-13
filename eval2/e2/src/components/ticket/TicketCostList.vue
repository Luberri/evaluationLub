<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAllCosts } from '../../services/ticket'

const props = defineProps({
    ticketId: {
        type: [Number, String],
        default: null,
    },
})

const router = useRouter()
const costs = ref([])

const normalizedTicketId = computed(() => {
    const value = Number(props.ticketId)
    return Number.isFinite(value) && value > 0 ? value : null
})

async function loadCosts() {
    if (!normalizedTicketId.value) {
        costs.value = []
        return
    }

    const response = await getAllCosts(normalizedTicketId.value)
    costs.value = Array.isArray(response?.data) ? response.data : []
}

function handleAddCost() {
    if (!normalizedTicketId.value) return
    router.push({
        path: '/fo/ticket/cost',
        query: { idTicket: normalizedTicketId.value }
    })
}

const totalGeneral = computed(() => {
    return costs.value.reduce((sum, cost) => {
        const timeCost = (cost.cost_time || 0) * (cost.duration || 0)
        const fixed = cost.cost_fixed || 0
        return sum + timeCost + fixed
    }, 0)
})

onMounted(loadCosts)
watch(() => props.ticketId, loadCosts)
</script>

<template>
    <div class="container">
        <h2>Coûts du ticket</h2>

        <button
            class="btn btn-primary mb-3"
            :disabled="!normalizedTicketId"
            @click="handleAddCost"
        >
            Ajouter un coût
        </button>
        <table class="table table-striped align-middle">
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Nom</td>
                    <td>Durée</td>
                    <td>Coût temps</td>
                    <td>Coût fixe</td>
                    <td>Date début</td>
                    <td>Total</td>
                </tr>
            </thead>

            <tbody>
                <tr v-for="cost in costs" :key="cost.id">
                    <td>{{ cost.id }}</td>
                    <td>{{ cost.name }}</td>
                    <td>{{ cost.duration }}</td>
                    <td>{{ cost.cost_time }}</td>
                    <td>{{ cost.cost_fixed }}</td>
                    <td>{{ cost.date_begin }}</td>
                    <td>
                        {{
                            ((cost.cost_time || 0) * (cost.duration/3600 || 0)) +
                            (cost.cost_fixed || 0)
                        }}
                    </td>
                </tr>

                <tr v-if="costs.length === 0">
                    <td colspan="7" class="text-center text-muted py-3">
                        Aucun coût
                    </td>
                </tr>
            </tbody>

            <tfoot v-if="costs.length > 0">
                <tr class="total-row">
                    <td colspan="6" class="text-end fw-bold">
                        Coût total du ticket
                    </td>
                    <td class="fw-bold total-value">
                        {{ totalGeneral.toLocaleString() }}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style scoped>
.total-row {
    background: linear-gradient(90deg, #f8fafc, #eef2ff);
    border-top: 2px solid #4f46e5;
}

.total-row td {
    padding: 14px !important;
    font-size: 1.05rem;
}

.total-value {
    color: #4f46e5;
    font-size: 1.2rem;
}
</style>