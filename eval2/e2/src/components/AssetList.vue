<script setup>
import { listItems, getAllItems } from '../services/item'
import { onMounted, ref } from 'vue';

const items = ref([])
const list = ref([])
onMounted(async () => {
    const o = await listItems()
    console.log('listItem ',o.data)
    items.value = o.data

    items.value.map(async (item) => {
        try {
            console.log('itemttt ', item.itemtype)
            const a = await getAllItems(item.itemtype, {fields : "id"})
            
            list.value.push(a.data)
        } catch (error) {
            console.error('Erreur chargement item:', error)
        }
    })
})

// function handleRowClick(item) {
//     if (!item?.id) return
//     router.push({ name: 'ticketCreate', query: { idTicket: ticket.id } })
// }
</script>
<template>
    <div class="container">
        <h1>liste des items</h1>
        <div class="cards">
            <div class="card" v-for="(l, index) in list" :key="index">
                <p class="card-title">{{ items[index]?.name }}</p>
                <p class="card-meta">{{ l.length }}</p>
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