<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAllSolution, getSolution, createSolution, updateSolution } from '../../services/ticket.js'

const route = useRoute()

const props = defineProps({
    ticketId: {
        type: [String, Number],
        default: null
    }
})

const currentTicketId = ref(null)
const solutions = ref([])
const editableSolutions = ref([])
const selectedSolutionId = ref(null)
const loading = ref(false)
const error = ref('')

const formData = reactive({
    content: '',
    status: 3,
    itemtype: 'Ticket',
})

const isEditMode = computed(() => !!selectedSolutionId.value)

function resetForm() {
    selectedSolutionId.value = null
    formData.content = ''
    formData.status = 3
    formData.itemtype = 'Ticket'
    error.value = ''
}

async function loadSolutions() {
    if (!currentTicketId.value) return
    try {
        const response = await getAllSolution(currentTicketId.value)
        const data = response?.data ?? []
        // normalize shape: many endpoints wrap item in { item: {...} }
        solutions.value = data.map((s) => s.item ?? s)
        // clone for inline editing
        editableSolutions.value = solutions.value.map((it) => ({ ...it }))
    } catch (err) {
        console.error('Erreur chargement solutions:', err)
        error.value = err?.message || 'Erreur chargement solutions'
    }
}

async function loadSolution(solutionId) {
    if (!currentTicketId.value || !solutionId) return
    try {
        const response = await getSolution(currentTicketId.value, solutionId)
        const raw = response?.data
        const solution = raw?.item ?? raw
        if (!solution) return
        selectedSolutionId.value = solution.id
        formData.content = solution.content || ''
        formData.status = solution.status ?? 3
        formData.itemtype = solution.itemtype || 'Ticket'
    } catch (err) {
        console.error('Erreur chargement solution:', err)
        error.value = err?.message || 'Erreur chargement solution'
    }
}

async function saveSolutionInline(id) {
    if (!currentTicketId.value) return
    const editable = editableSolutions.value.find((e) => e.id === id)
    if (!editable) return
    try {
        loading.value = true
        error.value = ''
        const payload = {
            itemtype: editable.itemtype || 'Ticket',
            content: editable.content,
            status: Number(editable.status) || 3,
            approver: { id: 2, name: 'glpi' },
        }
        await updateSolution(currentTicketId.value, id, payload)
        await loadSolutions()
    } catch (err) {
        console.error('Erreur update inline solution:', err)
        error.value = err?.response?.data || err?.message || 'Erreur update solution'
    } finally {
        loading.value = false
    }
}

async function handleSubmit() {
    if (!currentTicketId.value) {
        error.value = 'Ticket introuvable.'
        return
    }

    if (!formData.content.trim()) {
        error.value = 'Le contenu de la solution est obligatoire.'
        return
    }

    try {
        loading.value = true
        error.value = ''

        const payload = {
            itemtype: formData.itemtype,
            content: formData.content,
            status: Number(formData.status) || 3,
        }

        if (selectedSolutionId.value) {
            await updateSolution(currentTicketId.value, selectedSolutionId.value, payload)
        } else {
            await createSolution(currentTicketId.value, payload)
        }

        await loadSolutions()
        resetForm()
    } catch (err) {
        console.error('Erreur création/mise à jour solution:', err)
        error.value = err?.response?.data || err?.message || 'Erreur création/mise à jour solution'
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    const id = route.query?.idTicket || props.ticketId
    if (!id) return
    currentTicketId.value = Number(id)
    await loadSolutions()

    const solutionId = route.query?.idSolution
    if (solutionId) {
        await loadSolution(Number(solutionId))
    }
})
</script>

<template>
    <div class="ticket-solution-create">
        <h3>Solutions du ticket {{ currentTicketId }}</h3>

        <div v-if="!currentTicketId" class="alert alert-warning">
            Aucun ticket sélectionné.
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form class="mb-4" @submit.prevent="handleSubmit">
            <div class="row g-3">
                <div class="col-12">
                    <label class="form-label">Contenu de la solution</label>
                    <textarea class="form-control" v-model="formData.content" rows="5" required></textarea>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Statut</label>
                    <input type="number" class="form-control" v-model.number="formData.status" />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Type d'élément</label>
                    <input type="text" class="form-control" v-model="formData.itemtype" disabled />
                </div>
            </div>

            <div class="mt-3">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ isEditMode ? 'Modifier solution' : 'Créer solution' }}
                </button>
                <button type="button" class="btn btn-secondary ms-2" @click="resetForm" :disabled="loading">
                    Réinitialiser
                </button>
            </div>
        </form>

        <div v-if="solutions.length > 0">
            <h4>Liste des solutions</h4>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Contenu</th>
                        <th>Statut</th>
                        <th>Date création</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(sol, idx) in editableSolutions" :key="sol.id">
                        <td>{{ sol.id }}</td>
                        <td>
                            <textarea class="form-control" v-model="editableSolutions[idx].content" rows="2"></textarea>
                        </td>
                        <td>
                            <input type="number" class="form-control" v-model.number="editableSolutions[idx].status" />
                        </td>
                        <td>{{ sol.date_creation }}</td>
                        <td>
                            <button class="btn btn-sm btn-success me-2" :disabled="loading" @click="saveSolutionInline(sol.id)">Sauvegarder</button>
                            <button class="btn btn-sm btn-outline-primary" type="button" @click="loadSolution(sol.id)">Éditer dans le formulaire</button>
                        </td>
                    </tr>
                    <tr v-if="editableSolutions.length === 0">
                        <td colspan="5" class="text-center text-muted">Aucune solution</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
