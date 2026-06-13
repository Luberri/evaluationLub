<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAllTicket, TICKET_PRIORITY, getTicketTeamMember } from '../../services/ticket';
import { SESSION_TOKEN, ACCESS_TOKEN } from '../../util';

const router = useRouter()
const route = useRoute()
const tickets = ref([])
onMounted(async () => {
    const filter = route?.query?.filter
    const o = await getAllTicket(filter ? { filter } : {})
    console.log('getAllTicket ',o.data)
    const items = Array.isArray(o.data) ? o.data : []
    // const withMembers = await Promise.all(
    //     items.map(async (ticket) => {
    //         try {
    //             const teamMembersResponse = await getTicketTeamMember(ticket.id)
    //             const teamMembers = Array.isArray(teamMembersResponse.data)
    //                 ? teamMembersResponse.data
    //                 : []
    //             return { ...ticket, teamMembers }
    //         } catch (error) {
    //             console.error('Erreur chargement team members:', error)
    //             return { ...ticket, teamMembers: [] }
    //         }
    //     })
    // )
    tickets.value = items
    
})

function handleRowClick(ticket) {
    if (!ticket?.id) return
    router.push({ path: '/fo/ticket/create', query: { idTicket: ticket.id } })
}
</script>
<template>
    <div class="container py-3">
        <div class="d-flex gap-3 mb-3">
            <h1 class="mb-1">liste des tickets</h1>
            <button class="btn btn-primary" @click="router.push('/fo/ticket/create')">
                Creer ticket
            </button>
        </div>
        <div>
            <p>Session: {{ SESSION_TOKEN }}</p>
            <p>Access Token: {{ ACCESS_TOKEN }}</p>
        </div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <td>id</td>
                    <td>nom</td>
                    <td>status</td>
                    <td>priorite</td>
                    <!-- <td>demandeur</td>
                    <td>attr a</td> -->
                    <td>Modification</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in tickets" :key="t.id" @click="handleRowClick(t)" style="cursor: pointer;">
                    <td>{{ t.id }}</td>
                    <td>{{ t.name }}</td>
                    <td>{{ t.status.name }}</td>
                    <td>{{ TICKET_PRIORITY[t.priority] }}</td>
                    <!-- <td>
                        <span v-if="t.teamMembers.filter(t => t.role === 'requester').length">
                            {{ t.teamMembers.filter(t => t.role === 'requester')[0].name }}
                        </span>
                    </td>
                    <td>
                        <span v-if="t.teamMembers.filter(t => t.role === 'assigned').length">
                            {{ t.teamMembers.filter(t => t.role === 'assigned')[0].name }}
                        </span>
                    </td> -->
                    <td>{{ t.date_mod }}</td>
                </tr>
            </tbody>
        </table>
        <table></table>
    </div>

</template>