<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAllSolution } from '../../services/ticket'

const props = defineProps({
    ticketId: {
        type: [Number, String],
        default: null,
    },
})

const router = useRouter()
const solutions = ref([])

const normalizedTicketId = computed(() => {
    const value = Number(props.ticketId)
    return Number.isFinite(value) && value > 0 ? value : null
})

async function loadSolutions() {
    if (!normalizedTicketId.value) {
        solutions.value = []
        return
    }

    const response = await getAllSolution(normalizedTicketId.value)
    solutions.value = Array.isArray(response?.data) ? response.data : []
}

function handleAddSolution() {
    if (!normalizedTicketId.value) return
    router.push({ path: '/fo/ticket/solution', query: { idTicket: normalizedTicketId.value } })
}

onMounted(loadSolutions)
watch(() => props.ticketId, loadSolutions)
</script>

<template>
    <div class="container">
        <h2>Solutions du ticket</h2>
        <button class="btn btn-primary mb-3" :disabled="!normalizedTicketId" @click="handleAddSolution">
            Ajouter une solution
        </button>

        <table class="table table-striped">
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Contenu</td>
                    <td>Statut</td>
                    <td>Date création</td>
                    <td>Date approbation</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="solution in solutions" :key="solution.id">
                    <td>{{ solution.item.id }}</td>
                    <td>{{ solution.item.content }}</td>
                    <td>{{ solution.item.status }}</td>
                    <td>{{ solution.item.date_creation }}</td>
                    <td>{{ solution.item.date_approval ?? '-' }}</td>
                </tr>
                <tr v-if="solutions.length === 0">
                    <td colspan="5" class="text-center text-muted">Aucune solution</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
