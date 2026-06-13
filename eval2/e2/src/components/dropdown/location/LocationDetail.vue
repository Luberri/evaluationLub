<template>
    <div class="container row" v-if="form">
        <form class="container py-3 col-md-5 offset-md-1" @submit.prevent="submit">
            <h2>Detail location</h2>
            <div class="mb-3">
                <label class="form-label">Nom</label>
                <input v-model="form.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
                <label class="form-label">Nom complet</label>
                <input v-model="form.completename" type="text" class="form-control" />
            </div>
            <button type="submit" class="btn btn-primary mt-3">Modifier</button>
            <button type="button" @click="router.push('/dropdown/location')" class="btn btn-secondary mt-3 ms-2">Retour</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getLocation, updateLocation } from '../../../services/dropDown.js';

const route = useRoute();
const router = useRouter();
const form = ref(null);

onMounted(async () => {
  try {
    const res = await getLocation(route.params.id);
    form.value = res.data || res;
  } catch (error) {
    console.error(error);
  }
});

const submit = async () => {
  try {
    await updateLocation(route.params.id, form.value);
    router.push('/dropdown/location');
  } catch (error) {
    console.error(error);
  }
};
</script>