<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getTicketTeamMember } from '../../services/ticket'

const props = defineProps({
    ticketId: {
        type: [Number, String],
        default: null,
    },
})

const router = useRouter()
const ticketUsers = ref([])

const normalizedTicketId = computed(() => {
    const value = Number(props.ticketId)
    return Number.isFinite(value) && value > 0 ? value : null
})

async function loadTicketUsers() {
    if (!normalizedTicketId.value) {
        ticketUsers.value = []
        return
    }

    const response = await getTicketTeamMember(normalizedTicketId.value, { expand_dropdowns: true })
    ticketUsers.value = Array.isArray(response?.data) ? response.data : []
}

function handleAddTicketUser() {
    if (!normalizedTicketId.value) return
    router.push({ path: '/fo/ticket/teamMember', query: { idTicket: normalizedTicketId.value } })
}

onMounted(loadTicketUsers)
watch(() => props.ticketId, loadTicketUsers)
</script>

<template>
    <div class="container">
        <!-- <div class="col-md-6"> -->
            <h2>Ticket Users</h2>
            <button class="btn btn-primary mb-3" :disabled="!normalizedTicketId" @click="handleAddTicketUser">Ajouter un ticket user</button>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <td>id</td>
                        <td>user id</td>
                        <td>role</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tu in ticketUsers" :key="tu.id">
                        <td>{{ tu.id }}</td>
                        <td>{{ tu.name }}</td>
                        <td>{{ tu.role }}</td>
                    </tr>
                </tbody>
            </table>
        <!-- </div>  -->
    </div>
</template>