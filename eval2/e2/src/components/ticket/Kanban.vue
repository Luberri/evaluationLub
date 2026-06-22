<script setup>
import { onMounted,computed, ref, watch } from 'vue';
import { getAllTicket, getTicketTeamMember, updateTicket } from '../../services/ticket';
import { useRouter } from 'vue-router';
import draggable from 'vuedraggable'
import { deleteCoutSpring, getAllCoutLastSpring, getAllStatusSpring } from '../../services/spring';
import { VueFinalModal } from 'vue-final-modal'
import TicketTeamMemberCreate from './TicketTeamMemberCreate.vue'
import TicketTeamMemberList from './TicketTeamMemberList.vue';
import TicketSolutionCreate from './TicketSolutionCreate.vue';
import TicketCreate from './TicketCreate.vue';
import Cout from '../spring/Cout.vue';
import Reouv from '../spring/Reouv.vue';
import { traiter } from '../../services/ImportAlea.js';



const router = useRouter()

const all = ref([])
const ids = [{id: 1,nom: 'Nouveau'}, {id: 2, nom: 'En cours'}, {id: 6, nom: 'Clos'}]
const columns = ref({})
const ticketId = ref(null)

const listeStatus = ref([])

const pendingTicketId = ref(null)
const pendingStatusId = ref(null)

const showAddUser = ref(false)
const showAddSolution = ref(false)
const showDetail = ref(false)
const showRetour = ref(false)


onMounted(async () => {
    all.value = (await getAllTicket()).data
    listeStatus.value = (await getAllStatusSpring()).data

    ids.forEach(status => {
        columns.value[status.id] = all.value.filter(
            t => t.status?.id == status.id
        )
    })
})
async function validateAddUser() {
    await updateTicket(
        pendingTicketId.value,
        { status: pendingStatusId.value }
    )

    showAddUser.value = false

    pendingTicketId.value = null
    pendingStatusId.value = null

    all.value = (await getAllTicket()).data

    ids.forEach(status => {
        columns.value[status.id] = all.value.filter(
            t => t.status?.id == status.id
        )
    })
}
async function deleteCout(ticketId) {
    await traiter(ticketId, "cancel")
}
async function validateAddSolution() {
    await updateTicket(
        pendingTicketId.value,
        { status: pendingStatusId.value }
    )

    showAddSolution.value = false

    pendingTicketId.value = null
    pendingStatusId.value = null

    all.value = (await getAllTicket()).data

    ids.forEach(status => {
        columns.value[status.id] = all.value.filter(
            t => t.status?.id == status.id
        )
    })
}

async function change(e, statusId) {
    if (!e.added) return  // on s'intéresse seulement à la colonne qui reçoit

    const ticket = e.added.element

    const teams = (await getTicketTeamMember(ticket.id)).data
    if (statusId == 900000) {
        const b1 = teams.find(t => t.role == 'assigned')
        const b2 = teams.find(t => t.role == 'requester')
        
        if (!b1 || !b2) {
            pendingTicketId.value = ticket.id
            pendingStatusId.value = statusId
            ticketId.value = ticket.id
            showAddUser.value = true
        }
    } else if (statusId == 6) {
        pendingTicketId.value = ticket.id
        pendingStatusId.value = statusId
        ticketId.value = ticket.id
        //
        showAddSolution.value = true
    } else {
        pendingTicketId.value = ticket.id
        pendingStatusId.value = statusId
        ticketId.value = ticket.id
        showRetour.value = true
        await updateTicket(ticket.id, { status: statusId })
    }
}
async function openDetail(id) {
    ticketId.value = id
    showDetail.value = true
}
async function retour(id) {
    retrog.value =false
    await deleteCout(id)
}
</script>

<template>
    <h1 class="text-center mb-5 mt-5">Kanban Ticket</h1>
    <div class="container">
        <VueFinalModal v-model="showAddUser">
            <div class="modal d-block" tabindex="-1">
                <div class="modal-dialog  style="max-width: 90vw;>
                    <div class="modal-content">
                        <TicketTeamMemberList :ticketId="ticketId"/>
                        <TicketTeamMemberCreate :ticketId="ticketId"/>
                        <button class="btn btn-success" @click="validateAddUser">Valider</button>
                    </div>
                </div>
            </div>
        </VueFinalModal>

        <VueFinalModal v-model="showDetail">
            <div class="modal d-block" tabindex="-1">
                <div class="modal-dialog" style="max-width: 90vw;">
                    <div class="modal-content">
                        <TicketCreate :ticketId="ticketId"/>
                        <button class="btn btn-success  col-md-2" @click="showDetail = false">ok</button>
                    </div>
                </div>
            </div>
        </VueFinalModal>
        
        <VueFinalModal v-model="showAddSolution">
            <div class="modal d-block" tabindex="-1">
                <div class="modal-dialog" style="max-width: 90vw;">
                    <div class="modal-content">
                        <Cout :ticketId="ticketId"/>
                        <button class="btn btn-success  col-md-2" @click="validateAddSolution">ok</button>
                    </div>
                </div>
            </div>
        </VueFinalModal>

        <VueFinalModal v-model="showRetour">
            <div class="modal d-block" tabindex="-1">
                <div class="modal-dialog" style="max-width: 90vw;">
                    <div class="modal-content">
                        <Reouv :ticketId="ticketId"/>
                        <button style="max-width: 200px;" class="btn btn-danger" @click="deleteCout(ticketId)">effacer derniers coust</button>
                    </div>
                </div>
            </div>
        </VueFinalModal>
        
        <div class="row g-3 justify-content-center">
            <div v-for="id in ids" :key="id.id" class="col-md-3 m-3 p-3" :style="{borderRadius: '20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',backgroundColor: listeStatus.find(s => s.idGlpi == id.id)?.couleur}">
                <h3>{{ id.nom }} ({{ listeStatus.find(s => s.idGlpi == id.id)?.nomMalgache }}) | {{ columns[id.id]?.length }}</h3>
                <draggable
                    v-model="columns[id.id]"
                    group="tickets"
                    item-key="id"
                    @change="((e) => change(e, id.id))"
                >
                    <template #item="{ element }">
                        <div class="form-control m-2" style="cursor: grab;" @click="openDetail(element.id)">
                            {{ element.name }} ({{ element.id }})
                            <!-- {{ element.statusSpring }} -->
                        </div>
                    </template>
                </draggable>
                <button v-if="id.id == 1" class="btn m-2 btn-primary" @click="router.push('/fo/ticket/create')">
                    Ajouter un ticket
                </button>
            </div>
        </div>
    </div>
    

</template>
<style>
.modal-content-custom {
  width: 700px;
  max-width: 90vw;
}</style>