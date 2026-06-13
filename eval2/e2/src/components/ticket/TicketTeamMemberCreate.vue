<script setup>
import { getTicketTeamMember, updateTicketTeamMember, createTicketTeamMember, TICKET_USER_ROLE, TICKET_USER_TYPE } from '../../services/ticket'
import { inject, onMounted, reactive, ref, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import { getAllUser } from '../../services/user'

const props = defineProps({
    ticketId: {
        type: [String, Number],
        default: null
    }
})

const route = useRoute()
const ticketUserId = ref(null)
const users = ref([])

const formData = reactive({
    tickets_id: '', 
    users_id: '',
    role: '',
    type: '',
})
onMounted(async () => {
    const usersResponse = await getAllUser()
    users.value = usersResponse?.data ?? []
    console.log('userssss ', users.value[0])
    const id = route.query?.idTicketUser
    const idTicket = props.ticketId || route.query?.idTicket
    if (idTicket) {
        formData.tickets_id = idTicket
    }
    if (!id) return

    ticketUserId.value = Number(id)
    try {
        const response = await getTicketTeamMember(id)
        const data = response?.data
        const ticketUser = Array.isArray(data) ? data[0] : data
        if (!ticketUser) return

        formData.tickets_id = ticketUser.tickets_id || ''
        formData.users_id = ticketUser.users_id || ''
        formData.role = ticketUser.role || ''
        formData.type = ticketUser.type || ''
    } catch (error) {
        console.error('Erreur chargement ticket user:', error)
    }
})

async function handleCreation() {
    try {
        const payload = {
            id: Number(formData.users_id),
            role: String(formData.role),
            type: String(formData.type)
        }
        let response
        if (ticketUserId.value) {
            response = await updateTicketTeamMember(ticketUserId.value, payload)
        } else {
            response = await createTicketTeamMember(formData.tickets_id, payload)
        }
    } catch (error) {
        console.error('Erreur création/mise à jour ticket user:', error)
    }
}
</script>
<template>
    <h1>{{ticketUserId ? 'Modifier' : 'Créer'}} un ticket user</h1>
    <form class="container py-3" @submit.prevent="handleCreation">
        <div class="mb-3">
            <label class="form-label">ticketId</label>
            <input role="text" class="form-control" v-model="formData.tickets_id">
        </div>
        <div class="mb-3">
            <label class="form-label">User</label>
            <div class="input-group">
                <select class="form-select" v-model="formData.users_id">
                    <option value="">Sélectionner un utilisateur</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                        {{ user.username }}
                    </option>
                </select>
                <button type="button" class="btn btn-secondary" @click="$router.push({ path: '/bo/user/create', query: { idTicket: formData.tickets_id } })">+ User</button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">role</label>
            <select class="form-select" v-model="formData.role">
                <option v-for="(label, value) in TICKET_USER_ROLE" :key="value" :value="label">
                    {{ label }}
                </option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">type</label>
            <select class="form-select" v-model="formData.type">
                <option v-for="(label, value) in TICKET_USER_TYPE" :key="value" :value="label">
                    {{ label }}
                </option>
            </select>
        </div>
        <button role="submit" class="btn btn-primary">{{ticketUserId ? 'Modifier' : 'Créer'}}</button>
    </form>
</template>