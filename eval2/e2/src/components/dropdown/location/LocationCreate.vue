<template>
    <div class="container row">
        <form class="container py-3 col-md-5 offset-md-1" @submit.prevent="submit">
            <h2>Creation location</h2>
            <div class="mb-3">
                <label class="form-label">Nom</label>
                <input v-model="form.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
                <label class="form-label">Nom complet</label>
                <input v-model="form.completename" type="text" class="form-control" />
            </div>
            <button type="submit" class="btn btn-primary mt-3">Enregistrer</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createLocation } from '../../../services/dropDown.js';

const router = useRouter();
const form = ref({
  name: '',
  completename: ''
});

const submit = async () => {
  try {
    await createLocation(form.value);
    router.push('/dropdown/location');
  } catch (error) {
    console.error(error);
  }
};
</script>