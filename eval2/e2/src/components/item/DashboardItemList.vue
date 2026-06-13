<script setup>
import { useRouter } from 'vue-router';
import { listItems, getAllItems, ItemsComplete } from '../../services/item.js'
import { onMounted, ref } from 'vue';

const items = ref([])
const list = ref([])
const router = useRouter()
const sum = ref(0)
onMounted(async () => {
    const p = await ItemsComplete()

    console.log('listItemmmm ',p.data.items)
    items.value = p.data?.items

    list.value = p.data?.list
    console.log('valueeeee',p.data?.list)

    sum.value = list.value.length
})

function handleRowClick(item) {
    console.log("redirect",item )
    router.push({ path: '/fo/item/detailList', query: { itemstype: [item.itemtype] } })
}
</script>
<template>
    <div class="container">
        <h1>liste des items | total : {{ sum }}</h1>
        <div class="cards">
            <div class="card" v-for="(l, index) in items" :key="index" @click="handleRowClick(items[index])" style="cursor: pointer;">
                <p class="card-title">{{ l.itemtype }}</p>
                <p class="card-meta">{{ list.filter(p => p.item.name == l.name).length }}</p>
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