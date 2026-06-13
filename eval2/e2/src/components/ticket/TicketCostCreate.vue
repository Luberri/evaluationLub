x<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAllCosts, getCost, createCost, updateCost } from '../../services/ticket.js'

const route = useRoute()

const props = defineProps({
    ticketId: {
        type: [String, Number],
        default: null
    }
})

const currentTicketId = ref(null)
const costs = ref([])
const selectedCostId = ref(null)
const loading = ref(false)
const error = ref('')

const formData = reactive({
    name: '',
    comment: 'cost',
    date_begin: '',
    date_end: '',
    duration: 0,
    cost_time: 0,
    cost_fixed: 0,
    cost_material: 0,
})

const isEditMode = computed(() => !!selectedCostId.value)

function normalizeDateInput(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const offsetMs = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

function toISOStringLocal(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString()
}

function resetForm() {
    selectedCostId.value = null
    formData.name = ''
    formData.comment = 'cost'
    formData.date_begin = ''
    formData.date_end = ''
    formData.duration = 0
    formData.cost_time = 0
    formData.cost_fixed = 0
    formData.cost_material = 0
    error.value = ''
}

async function loadCosts() {
    if (!currentTicketId.value) return
    try {
        const response = await getAllCosts(currentTicketId.value)
        costs.value = response?.data ?? []
    } catch (err) {
        console.error('Erreur chargement coûts:', err)
        error.value = err?.message || 'Erreur chargement coûts'
    }
}

async function loadCost(costId) {
    if (!currentTicketId.value || !costId) return
    try {
        const response = await getCost(currentTicketId.value, costId)
        const cost = response?.data
        if (!cost) return
        selectedCostId.value = cost.id
        formData.name = cost.name || ''
        formData.comment = cost.comment || 'cost'
        formData.date_begin = normalizeDateInput(cost.date_begin)
        formData.date_end = normalizeDateInput(cost.date_end)
        formData.duration = cost.duration ?? 0
        formData.cost_time = cost.cost_time ?? 0
        formData.cost_fixed = cost.cost_fixed ?? 0
        formData.cost_material = cost.cost_material ?? 0
    } catch (err) {
        console.error('Erreur chargement coût:', err)
        error.value = err?.message || 'Erreur chargement coût'
    }
}

async function handleSubmit() {
    if (!currentTicketId.value) {
        error.value = 'Ticket introuvable.'
        return
    }

    try {
        loading.value = true
        error.value = ''

        const payload = {
            name: formData.name,
            comment: formData.comment,
            date_begin: toISOStringLocal(formData.date_begin),
            date_end: toISOStringLocal(formData.date_end),
            duration: Number(formData.duration) || 0,
            cost_time: Number(formData.cost_time) || 0,
            cost_fixed: Number(formData.cost_fixed) || 0,
            cost_material: Number(formData.cost_material) || 0,
        }

        if (selectedCostId.value) {
            await updateCost(currentTicketId.value, selectedCostId.value, payload)
        } else {
            await createCost(currentTicketId.value, payload)
        }

        await loadCosts()
        resetForm()
    } catch (err) {
        console.error('Erreur création/mise à jour coût:', err)
        error.value = err?.response?.data || err?.message || 'Erreur création/mise à jour coût'
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    const id = route.query?.idTicket || props.ticketId
    if (!id) return
    currentTicketId.value = Number(id)
    await loadCosts()

    const costId = route.query?.idCost
    if (costId) {
        await loadCost(Number(costId))
    }
})
</script>

<template>
    <div class="container py-3">
        <h3>Coûts du ticket</h3>

        <div v-if="!currentTicketId" class="alert alert-warning">
            Aucun ticket sélectionné.
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form class="mb-4" @submit.prevent="handleSubmit">
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Nom du coût</label>
                    <input class="form-control" v-model="formData.name" required />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Commentaire</label>
                    <input class="form-control" v-model="formData.comment" />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Début</label>
                    <input type="datetime-local" class="form-control" v-model="formData.date_begin" required />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Fin</label>
                    <input type="datetime-local" class="form-control" v-model="formData.date_end" required />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Durée (secondes)</label>
                    <input type="number" min="0" class="form-control" v-model.number="formData.duration" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Coût temps</label>
                    <input type="number" step="0.01" min="0" class="form-control" v-model.number="formData.cost_time" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Coût fixe</label>
                    <input type="number" step="0.01" min="0" class="form-control" v-model.number="formData.cost_fixed" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Matériel</label>
                    <input type="number" step="0.01" min="0" class="form-control" v-model.number="formData.cost_material" />
                </div>
            </div>

            <div class="mt-3">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ isEditMode ? 'Modifier coût' : 'Créer coût' }}
                </button>
                <button type="button" class="btn btn-secondary ms-2" @click="resetForm" :disabled="loading">
                    Réinitialiser
                </button>
            </div>
        </form>

        <div v-if="costs.length > 0">
            <h4>Liste des coûts</h4>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Durée</th>
                        <th>Coût temps</th>
                        <th>Coût fixe</th>
                        <th>Matériel</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cost in costs" :key="cost.id">
                        <td>{{ cost.id }}</td>
                        <td>{{ cost.name }}</td>
                        <td>{{ cost.duration }}</td>
                        <td>{{ cost.cost_time }}</td>
                        <td>{{ cost.cost_fixed }}</td>
                        <td>{{ cost.cost_material ?? 0 }}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-outline-primary" @click="loadCost(cost.id)">
                                Éditer
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
