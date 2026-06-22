<script setup>
import { onMounted, ref } from 'vue';
import { getAllCoutSpring, updateCoutSpring } from '../../services/spring';
import { parseNumber, updateCout, updateReouv } from '../../services/ImportAlea';

const all = ref([])
async function load() {
    all.value = (await getAllCoutSpring()).data
}
onMounted(async () => {
    all.value = (await getAllCoutSpring()).data
})
async function Modifier(c) {
    const formData = { idTicket: c.idTicket, pourc: parseNumber(c.pourc) }
    await updateReouv(c.id, c.idTicket,formData,c.mode)
    load()
}
async function ModifierCout(c) {
    const formData = { coutSuper:c.coutSuper }
    await updateCout(c.id,formData)
    load()
}
async function Sup(c) {
    // const formData = { idTicket:c.idTicket,  }
    
    await updateCoutSpring(c.id,
    { 
        idTicket: c.idTicket, 
        groupe: c.groupe, 
        coutSuper: 0, 
        itemType: null,  
        motif: c.motif 
    }
    )
}
</script>
<template>
    <h1>reouverture et cout</h1>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>id</th>
                <th>cout_super</th>
                <th>id_ticket_glip</th>
                <th>motif</th>
                <th>action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="c in all">
                <!-- <form @submit.prevent="handleModif"> -->
                    <td>{{ c.id }}</td>
                    <td>
                        <input type="number" v-model="c.coutSuper">
                    </td>
                    <td>{{ c.idTicket }}</td>
                    <td>{{ c.motif }}</td>
                    <td v-if="c.motif == 'reouv'">
                        <input type="number" v-model="c.pourc">%
                        <input type="number" v-model="c.mode">Mode
                        <button class="btn btn-primary" @click="Modifier(c)">Modifier</button>
                        <!-- <button class="btn btn-danger" @click="Sup(c)">sup</button> -->
                    </td>
                    <td v-else>
                        <button class="btn btn-primary" @click="ModifierCout(c)">Modifier cout</button>
                        <!-- <button class="btn btn-danger" @click="Sup(c)">sup</button> -->
                    </td>
                <!-- </form> -->
            </tr>
        </tbody>
    </table>
</template>