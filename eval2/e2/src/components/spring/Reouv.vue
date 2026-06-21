<script setup>
import { onMounted,ref } from 'vue';
import { getAllCoutLastSpring,getAllCoutSpring, createCoutSpring, deleteCoutSpring, updateCoutSpring } from '../../services/spring';
import { getTicket } from '../../services/ticket';
import { traiter } from '../../services/ImportAlea';

const props = defineProps({
    ticketId: {
        type: [Number, String],
        default: null,
    },
})
const formData = ref({
    idTicket: 0,
    pourc: 0,
    mode: 1,
})
async function create() {
    // const a = await getTicket(props.ticketId ?? 1000)
    // const s = (await getAllCoutLastSpring(props.ticketId)).data
    // let f = 0
    // if (s[0]) {
    //     f = s[0].groupe
    //     await Promise.all(
    //         s.map(async (y) => {
    //             await createCoutSpring({
    //                 idTicket: formData.value.idTicket,
    //                 groupe:(f),
    //                 coutSuper:(y.coutSuper)*formData.value.pourc/100,
    //                 itemType:y.itemType,
    //                 motif:"reouv"
    //             })
    //         })
    //     )
    // } else {
    //     alert("tsisy last cout super")
    // }
    await traiter(props.ticketId, "open", formData.value.pourc,formData.value.mode)
}
onMounted(async () => {
    formData.value.idTicket = props.ticketId
})
</script>
<template>
    <div class="container py-3">
        <h1>Create Reouverture</h1>
        <form class="container" @submit.prevent="create">
            <div class="row g-3 mb-3 align-items-end">
                <div class="col-md-4">
                    <label class="form-label">id ticket</label>
                    <input type="text" class="form-control" v-model="formData.idTicket">
                </div>
                <div class="col-md-4">
                    <label class="form-label">pourc</label>
                    <input type="text" class="form-control" v-model="formData.pourc">
                </div>
                <!-- <div class="col-md-4">
                    <label class="form-label">mode</label>
                    <input type="text" class="form-control" v-model="formData.mode">
                </div> -->
                    <select v-model="formData.mode" class="form-select form-select-sm mb-3">
                        <option value="1">1 | farany</option>
                        <option value="2">2 | voalohany</option>
                        <option value="3">3 | moyenne</option>
                        <option value="4">4 | somme</option>
                    </select>
                <button class="btn btn-primary col-md-2" type="submit">Créer cout</button>
            </div>
        </form>
    </div>
</template>