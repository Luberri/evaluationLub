<script setup>
import { onMounted, inject, ref,reactive } from 'vue';
import { createItem, getItem, updateItem } from '../../services/item';
import { useRouter,useRoute } from 'vue-router';
import { getAllItemModels, getAllItemTypes, getAllLocations, getAllManufacturers, getAllStates } from '../../services/dropDown';

const itemType = ref(null)
const itemId = ref(null)

const route = useRoute()
const router = useRouter()


const status = ref([])
const locations = ref([])
const manufacturers = ref([])

const types = ref([])
const models = ref([])

const formData = reactive({
    name: '',
    status: '',
    location: '',
    comment: '',
    manufacturer: '',
    model: '',
    otherserial: '',
    user: '',
    date_mod: '',
    type: ''
});
async function charger() {
    const id = route.query?.iditem
    const type = route.query?.itemtype
    if (!type || !id) return
    itemId.value = Number(id)
    try {
        
        const a = await getItem(itemType.value, itemId.value)
    
        const item = a.data
        if (!item) return
    
        formData.name = item.name
        formData.status = item.status
        formData.location = item.location
        formData.comment = item.comment
        formData.manufacturer = item.manufacturer
        formData.model = item.model
        formData.otherserial = item.otherserial
        formData.user = item.user
        formData.date_mod = item.date_mod
        formData.type = item.type
    } catch (error) {
        console.error('Erreur chargement item:', error)
    }

}
onMounted(async () => {
    const id = route.query?.iditem
    const type = route.query?.itemtype
    if (!type) return
    itemType.value = type
    console.log("etooooo ", type)

    const [resStatus, resLoc, resManuf, resTypes, resModels] = await Promise.all([
        getAllStates(), getAllLocations(), getAllManufacturers(), getAllItemTypes(itemType.value), getAllItemModels(itemType.value)
    ])
    status.value = resStatus.data || resStatus || []
    locations.value = resLoc.data || resLoc || []
    manufacturers.value = resManuf.data || resManuf || []
    types.value = resTypes.data || resTypes || []
    models.value = resModels.data || resModels || []

    await charger()
});
async function handleCreation() {
    try {
        const payload = {
            name: formData.name,
            status: Number(formData.status),
            location: Number(formData.location),
            comment: formData.comment,
            manufacturer: Number(formData.manufacturer),
            model: Number(formData.model),
            otherserial: formData.otherserial,
            user: formData.user,
            type: formData.type
        }
        let response
        if (itemId.value) {
            response = await updateItem(itemId.value, itemType.value, payload)
            formData.date_mod = response.data.date_mod
        } else {
            console.log("payload ", payload)
            response = await createItem(itemType.value, payload)
            router.replace({query: { idItem: response.data.id ,itemtype: itemType.value} })
        }
        
    } catch (error) {
        console.error('Erreur creation/modification ticket:', error)
    }
}
</script>
<template>
    <div class="container py-3">
        <h1>{{ itemId ? 'Modification' : 'Creation' }} item : <i>{{ itemType }}</i></h1>

        <form v-if=itemType class="container mt-4" @submit.prevent="handleCreation">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" v-model="formData.name">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Status (State)</label>
                    <select class="form-select" v-model="formData.status">
                        <option value=""></option>
                        <option v-for="st in status" :key="st.id" :value="st.id">{{ st.name }}</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Location</label>
                    <select class="form-select" v-model="formData.location">
                        <option value=""></option>
                        <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.completename || loc.name }}</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Manufacturer</label>
                    <select class="form-select" v-model="formData.manufacturer">
                        <option value=""></option>
                        <option v-for="manuf in manufacturers" :key="manuf.id" :value="manuf.id">{{ manuf.name }}</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Model</label>
                    <select class="form-select" v-model="formData.model">
                        <option value=""></option>
                        <option v-for="mod in models" :key="mod.id" :value="mod.id">{{ mod.name }}</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">type</label>
                    <select class="form-select" v-model="formData.type">
                        <option value=""></option>
                        <option v-for="t in types" :key="t.id" :value="t.id">{{ t.name }}</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Other Serial</label>
                    <input type="text" class="form-control" v-model="formData.otherserial">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">User ID</label>
                    <input type="text" class="form-control" v-model="formData.user">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Date Mod</label>
                    <input type="text" class="form-control" v-model="formData.date_mod" disabled>
                </div>
                <div class="col-md-12 mb-3">
                    <label class="form-label">Comment</label>
                    <textarea class="form-control" v-model="formData.comment" rows="3"></textarea>
                </div>
            </div>
            
            <button type="submit" class="btn btn-primary mt-3">Enregistrer</button>
        </form>
    </div>
</template>