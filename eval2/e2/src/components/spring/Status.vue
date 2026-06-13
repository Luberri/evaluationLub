<script setup>
import { onMounted, ref } from 'vue';
import { getAllStatusSpring, createStatusSpring, deleteStatusSpring, updateStatusSpring } from '../../services/spring';
import { TICKET_STATUS } from '../../services/ticket';

const listeStatus = ref([])
const formData = ref({
    idGlpi: '',
    nomMalgache: '',
    couleur: '#000000',
})
async function createStatus() {
    await createStatusSpring(formData.value)
    await loadStatus()
}
async function loadStatus() {
    listeStatus.value = (await getAllStatusSpring()).data
}
onMounted(async () => {
    await loadStatus()
})
async function deleteStatus(id) {
    await deleteStatusSpring(id)
    await loadStatus()
}
async function updateStatus(s) {
    await updateStatusSpring(s.id,s)
    await loadStatus()
}
</script>
<template>
    <div class="container py-3">
        <h1>Status Spring</h1>
        <table class="table table-striped align-items-center">
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
                        <select class="form-select" v-model="s.idGlpi">
                            <option v-for="(label, value) in TICKET_STATUS" :key="value" :value="value">
                                {{ label }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <input class="form-control" type="text" v-model="s.nomMalgache">
                    </td>
                    <td>
                        <input type="color" class="form-control form-control-color" v-model="s.couleur">
                    </td>
                    <td><button class="btn btn-primary me-3" @click="updateStatus(s)">MODIFIER</button>
                    <button class="btn btn-danger" @click="deleteStatus(s.id)">DELETE</button></td>
                </tr>
            </tbody>
        </table>
        <h1>Create Status Spring</h1>
        <form class="container" @submit.prevent="createStatus">
            <div class="row g-3 mb-3 align-items-end">
                <div class="col-md-4">
                    <label class="form-label">id glpi</label>
                    <select class="form-select" v-model="formData.idGlpi">
                        <option v-for="(label, value) in TICKET_STATUS" :key="value" :value="value">
                            {{ label }}
                        </option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">nom Malgache</label>
                    <input type="text" class="form-control" v-model="formData.nomMalgache">
                </div>
                <div class="col-md-2">
                    <label class="form-label">couleur</label>   
                    <input type="color" class="form-control form-control-color" v-model="formData.couleur">
                </div>
                <button class="btn btn-primary col-md-2" type="submit">Créer status</button>
            </div>
        </form>
    </div>
</template>