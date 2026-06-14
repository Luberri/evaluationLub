<script setup>
import { onMounted, ref } from 'vue';
import { getAllCoutSpring, createCoutSpring, deleteCoutSpring, updateCoutSpring } from '../../services/spring';
import { getTicket, TICKET_STATUS } from '../../services/ticket';


const props = defineProps({
    ticketId: {
        type: [Number, String],
        default: null,
    },
})
const t = ref(0)
const listeStatus = ref([])
const formData = ref({
    idTicket: 0,
    coutSuper: 0,
})
async function createCout() {
    const a = await getTicket(props.ticketId ?? 1000)
    // const yyyy = 0
    const s = (await getAllCoutSpring()).data
    let f = 0
    if (s[0]) {
        f = s[s.length-1].groupe
    }
    await Promise.all(
        a.data.items.map(async (y) => {
            await createCoutSpring({idTicket:formData.value.idTicket,groupe:(f+1),coutSuper:formData.value.coutSuper/a.data.items.length,itemType:y.itemtype,motif:"cout"})
        })
    )
    await loadCout()
}
async function loadCout() {
    listeStatus.value = (await getAllCoutSpring()).data
    
}
onMounted(async () => {
    
    formData.value.idTicket = props.ticketId ?? 10000
    console.log('lwlwllwwv ',formData.value.idTicket)
    await loadCout()
})
async function deleteCout(id) {
    await deleteCoutSpring(id)
    await loadCout()
}
async function updateCout(s) {
    await updateCoutSpring(s.id,s)
    await loadCout()
}
</script>
<template>
    <div class="container py-3">
        <h1>Cout Spring</h1>
        <!-- <table class="table table-striped align-items-center">
            <thead>
                <tr>
                    <th>id</th>
                    <th>id glpi</th>
                    <th>nom Malgache</th>
                    <th>couleur</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="s in listeStatus">
                    <td>{{ s.id }}</td>
                    <td>
                        <select class="form-select" v-model="s.idTicket">
                            <option v-for="(label, value) in TICKET_STATUS" :key="value" :value="value">
                                {{ label }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <input class="form-control" type="text" v-model="s.coutSuper">
                    </td>
                    <td>
                        <input type="color" class="form-control form-control-color" v-model="s.couleur">
                    </td>
                    <td><button class="btn btn-primary me-3" @click="updateCout(s)">MODIFIER</button>
                    <button class="btn btn-danger" @click="deleteCout(s.id)">DELETE</button></td>
                </tr>
            </tbody>
        </table> -->
        <h1>Create Cout Spring</h1>
        <form class="container" @submit.prevent="createCout">
            <div class="row g-3 mb-3 align-items-end">
                <div class="col-md-4">
                    <label class="form-label">id ticket</label>
                    <input type="text" class="form-control" v-model="formData.idTicket">
                </div>
                <div class="col-md-4">
                    <label class="form-label">cout fixe</label>
                    <input type="text" class="form-control" v-model="formData.coutSuper">
                </div>
                <button class="btn btn-primary col-md-2" type="submit">Créer cout</button>
            </div>
        </form>
    </div>
</template>