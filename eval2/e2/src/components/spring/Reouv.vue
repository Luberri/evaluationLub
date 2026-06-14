<script setup>
import { onMounted,ref } from 'vue';
import { getAllCoutLastSpring,getAllCoutSpring, createCoutSpring, deleteCoutSpring, updateCoutSpring } from '../../services/spring';
import { getTicket } from '../../services/ticket';

const props = defineProps({
    ticketId: {
        type: [Number, String],
        default: null,
    },
})
const formData = ref({
    idTicket: 0,
    pourc: 0,
})
async function createReouv() {
    const a = await getTicket(props.ticketId ?? 1000)
    const s = (await getAllCoutLastSpring(props.ticketId)).data
    let f = 0
    if (s[0]) {
        f = s[0].groupe
        await Promise.all(
            s.map(async (y) => {
                await createCoutSpring({
                    idTicket: formData.value.idTicket,
                    groupe:(f),
                    coutSuper:(y.coutSuper)*formData.value.pourc/100,
                    itemType:y.itemType,
                    motif:"reouv"
                })
            })
        )
    } else {
        alert("tsisy last cout super")
    }
}
onMounted(async () => {
    formData.value.idTicket = props.ticketId ?? 10000
})
</script>
<template>
    <div class="container py-3">
        <h1>Create Reouverture</h1>
        <form class="container" @submit.prevent="createReouv">
            <div class="row g-3 mb-3 align-items-end">
                <div class="col-md-4">
                    <label class="form-label">id ticket</label>
                    <input type="text" class="form-control" v-model="formData.idTicket">
                </div>
                <div class="col-md-4">
                    <label class="form-label">pourc</label>
                    <input type="text" class="form-control" v-model="formData.pourc">
                </div>
                <button class="btn btn-primary col-md-2" type="submit">Créer cout</button>
            </div>
        </form>
    </div>
</template>