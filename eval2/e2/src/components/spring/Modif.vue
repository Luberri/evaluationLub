<script setup>
import { onMounted, ref } from 'vue';
import { getAllCoutSpring, updateCoutSpring } from '../../services/spring';

const all = ref([])
onMounted(async () => {
    all.value = (await getAllCoutSpring()).data
})
async function Modifier(c) {
    const formData = { idTicket: ticket, pourc: parseNumber(valeur) },mode
    
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
                    </td>
                    <td>
                         <button class="btn btn-primary" @click="Modifier(c)">Modifier</button>
                    </td>
                <!-- </form> -->
            </tr>
        </tbody>
    </table>
</template>