<script setup>
import { onMounted,ref } from 'vue';
import { getAllTicket } from '../../services/ticket';
import { useRouter } from 'vue-router'

const ticketsDemande = ref([])
const ticketsIncident = ref([])
const sum = ref(0)
const router = useRouter()

onMounted(async () => {
    const [demande, incident] = await Promise.all([
        getAllTicket({ filter: "type==2" }),
        getAllTicket({ filter: "type==1" })
    ])

    ticketsDemande.value = demande.data
    ticketsIncident.value = incident.data
    sum.value = ticketsDemande.value.length + ticketsIncident.value.length
});
function handleRowClick(type) {
    const filter = type === 1 ? "type==1" : "type==2"
    router.push({ path: '/fo/ticket', query: { filter : filter } })
}
</script>

<template>
    <div class="container">
        <h1>liste des tickets | total : {{ sum }}</h1>
        <div class="cards"> 
            <div class="card" @click="handleRowClick(1)" style="cursor: pointer;">
                <p class="card-title">Incident</p>
                <p class="card-meta">{{ ticketsIncident.length }}</p>
            </div>
            <div class="card" @click="handleRowClick(2)" style="cursor: pointer;">
                <p class="card-title">Demande</p>
                <p class="card-meta">{{ ticketsDemande.length }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 12px;
}

.card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px 16px;
    min-width: 180px;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.card-title {
    margin: 0 0 6px;
    font-weight: 600;
}

.card-meta {
    margin: 0;
    color: #444444;
}
</style>