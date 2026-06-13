    <script setup>
import { onMounted, reactive,computed, ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { getAllItems,listItems, getItem } from '../../services/item';

const list = ref([])
const route = useRoute()
const router = useRouter()
const itemstype = ref([])

const filtre = reactive({
    name: '',
    status: '',
    location: '',
    model: ''
})
const filteredList = computed(() => {
    return list.value.filter(item => {
        const nameMatch =
            !filtre.name ||
            item?.name?.toLowerCase().includes(filtre.name.toLowerCase())

        const statusMatch =
            !filtre.status ||
            item?.status?.name?.toLowerCase().includes(filtre.status.toLowerCase())

        const locationMatch =
            !filtre.location ||
            item?.location?.name?.toLowerCase().includes(filtre.location.toLowerCase())

        const modelMatch =
            !filtre.model ||
            item?.model?.toLowerCase().includes(filtre.model.toLowerCase())
            

        return (
            nameMatch &&
            statusMatch &&
            locationMatch &&
            modelMatch
        )
    })
})
onMounted(async () => {
    if (!route.query.itemstype) {
        const t = await listItems()
        itemstype.value = t.data.map(i => i.itemtype)
    } else {
        itemstype.value = [route.query.itemstype]
    }
    const rs = await Promise.all(itemstype.value.map(async (type) => {
        try {
            const a = await getAllItems(type)
            return [...a.data,type]
        } catch (error) {
            console.error('Erreur chargement item:', error)
            return []
        }
    }))
    list.value = rs.flat()
})
function go(id) {
    router.push({ path: '/fo/item/create', query: { itemtype: route.query.itemstype, iditem: id} })
}
</script>
<template>
    <div class="container py-3">
        <div class="d-flex gap-3 mb-3">
            <h1 class="mb-1">Liste des items</h1>
            <button class="btn btn-primary" @click="router.push({ path: '/fo/item/create', query: { itemtype: route.query.itemstype } })">
                + Ajouter
            </button>
        </div>
        <div class="row align-items-end g-3 mb-3">
            <div class="col-md-2">
                <label class="form-label">name</label>
                <input type="text" class="form-control" v-model="filtre.name">
            </div>
            <div class="col-md-2">
                <label class="form-label">status</label>
                <input type="text" class="form-control" v-model="filtre.status">
            </div>
            <div class="col-md-2">
                <label class="form-label">location</label>
                <input type="text" class="form-control" v-model="filtre.location">
            </div>
            <div class="col-md-2">
                <label class="form-label">model</label>
                <input type="text" class="form-control" v-model="filtre.model">
            </div>
            <div class="col-md-3"><button class="btn btn-danger" @click="clearFilter()">Clear</button></div>
        </div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>status</th>
                    <th>Location</th>
                    <th>item type</th>
                    <th>Model</th>
                    <th>Iventory number</th>
                    <th>user</th>
                </tr>
            </thead>
            <tbody>
                <tr @click="go(a.id)" v-for="a in filteredList">
                    <td>{{ a?.id }}</td>
                    <td>{{ a?.name }}</td>
                    <td>{{ a?.status?.name }}</td>
                    <td>{{ a?.location?.name }}</td>
                    <td>{{ a?.type?.name }}</td>
                    <td>{{ a?.model }}</td>
                    <td>{{ a?.otherserial }}</td>
                    <td>{{ a?.user?.name }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>