<script setup>
import { inject, onMounted, reactive, ref, watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { getTicketItems, createTicket, getTicket, updateTicket, TICKET_URGENCY, TICKET_IMPACT, TICKET_TYPE, TICKET_STATUS } from '../../services/ticket.js'
import TicketTeamMemberList from './TicketTeamMemberList.vue'
import { ItemsComplete } from '../../services/item.js'
import TicketCostList from './TicketCostList.vue'
import TicketSolutionList from './TicketSolutionList.vue'
// import TicketTeamMemberCreate from './TicketTeamMemberCreate.vue'

const route = useRoute()
const router = useRouter()

const ticketId = ref(null)
const itemsComplete = ref([])

const props = defineProps({
    ticketId: {
        type: [String, Number],
        default: null
    }
})

const formData = reactive({
    name: '',
    content: '',
    type: '',
    urgency: '',
    impact: '',
    statusId: '',
    items: [],
    dateModification: '',
})

onMounted(async () => {
    const id = route.query?.idTicket || props.ticketId
    if (!id) return
    ticketId.value = Number(id)
    try {
        const [rt, response] = await Promise.all([
            getTicketItems(ticketId.value),
            getTicket(id)
        ])

        const ticket = response.data
        if (!ticket) return

        formData.name = ticket.name || ''
        formData.content = ticket.content || ''
        formData.type = ticket.type ?? ''
        formData.urgency = ticket.urgency ?? ''
        formData.impact = ticket.impact ?? ''
        formData.statusId = ticket?.status?.id ?? ticket?.status ?? ''
        formData.items = rt
        formData.dateModification = new Date(ticket.date_mod)

        // const existingIds = rt.map(x => x.items_id).filter(Boolean)
        // const filter = existingIds.length > 0 ? { filter: `id=out=(${existingIds.join(',')})` } : {}
        // const ss = await ItemsComplete(filter)
        // itemsComplete.value = ss.data?.list ?? []

    } catch (error) {
        console.error('Erreur chargement ticket:', error)
    }
})

watch(() => formData.items, async (i) => {
    try {
        const existingNames = i.map(x => x.name).filter(Boolean)
        const filter = existingNames.length > 0 ? { filter: existingNames.map(e => `name!=${e}`).join(";")} : {}
        const ss = await ItemsComplete(filter)
        itemsComplete.value = ss.data?.list ?? []
    } catch (error) {
        console.error('Erreur chargement items dispo:', error)
    }
}, { immediate: true, deep: true })

async function handleCreation() {
    try {
        const payload = {
            name: formData.name,
            content: formData.content,
            type: Number(formData.type),
            urgency: Number(formData.urgency),
            impact: Number(formData.impact),
            status: Number(formData.statusId),
            items: formData.items.map(i => ({
                itemtype: i.itemtype,
                items_id: i.items_id ?? i.id
            }))
        }
        let response
        if (ticketId.value) {
            response = await updateTicket(ticketId.value, payload)
            formData.dateModification = response.data.date_mod
        } else {
            response = await createTicket(payload)
            router.replace({query: { idTicket: response.data.id } })

        }
    } catch (error) {
        console.error('Erreur creation/modification ticket:', error)
    }
}

async function additem(item) {
    const exists = formData.items.find(i => i.items_id === item.id && i.itemtype === item.item.itemtype)
    if (!exists) {
        formData.items.push({
            ...item,
            itemtype: item.item.itemtype,
            items_id: item.id
        })
    }
}

async function removeItem(index) {
    formData.items.splice(index, 1)
}
</script>

<template>
    <div class="container row" style="display: flex;">
        <form class="container py-3 col-md-5 offset-md-1" @submit.prevent="handleCreation">
            <h2>{{ ticketId ? 'Modification ticket' : 'Creation ticket' }}</h2>
            <div class="mb-3">
                <label class="form-label">Nom</label>
                <input type="text" class="form-control" v-model="formData.name">
            </div>
            <div class="mb-3">
                <label class="form-label">Contenu</label>
                <input type="text" class="form-control" v-model="formData.content">
            </div>
            <div class="mb-3">
                <label class="form-label">Type</label>
                <select class="form-select" v-model="formData.type">
                    <option v-for="(label, value) in TICKET_TYPE" :key="value" :value="value">
                        {{ label }}
                    </option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Urgence</label>
                <select class="form-select" v-model="formData.urgency">
                    <option v-for="(label, value) in TICKET_URGENCY" :key="value" :value="value">
                        {{ label }}
                    </option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Impact</label>
                <select class="form-select" v-model="formData.impact">
                    <option v-for="(label, value) in TICKET_IMPACT" :key="value" :value="value">
                        {{ label }}
                    </option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" v-model="formData.statusId">
                    <option v-for="(label, value) in TICKET_STATUS" :key="value" :value="value">
                        {{ label }}
                    </option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Date Modification</label>
                <p class="form-control">{{ formData.dateModification.toLocaleString() }}</p>
            </div>
            <button class="btn btn-primary" type="submit">{{ ticketId ? 'Modifier ticket' : 'Créer ticket' }}</button>
        </form>

        <div class="container row py-3 col-md-6">
            <!-- <div class="container offset-md-1"> -->

                <h2>Éléments du ticket</h2>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nom</th>
                            <th>Type</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in formData.items" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.itemtype }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" @click="removeItem(index)">Retirer</button>
                            </td>
                        </tr>
                        <tr v-if="formData.items.length === 0">
                            <td colspan="4" class="text-center text-muted">Aucun élément</td>
                        </tr>
                    </tbody>
                </table>

                <h2>Éléments disponibles</h2>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nom</th>
                            <th>Itemtype</th>
                            <th>Type</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="itemDispo in itemsComplete" :key="itemDispo.id">
                            <td>{{ itemDispo.id }}</td>
                            <td>{{ itemDispo.name }}</td>
                            <td>{{ itemDispo.item?.name }}</td>
                            <td>{{ itemDispo.type?.name }}</td>
                            <td>
                                <button class="btn btn-success btn-sm" @click="additem(itemDispo)">Ajouter</button>
                            </td>
                        </tr>
                        <tr v-if="itemsComplete.length === 0">
                            <td colspan="5" class="text-center text-muted">Aucun élément disponible</td>
                        </tr>
                    </tbody>
                </table>
                <TicketTeamMemberList :ticketId="ticketId" />
                <TicketCostList :ticketId="ticketId" />
                <TicketSolutionList :ticketId="ticketId" />
            <!-- </div> -->

        </div>
    </div>
</template>