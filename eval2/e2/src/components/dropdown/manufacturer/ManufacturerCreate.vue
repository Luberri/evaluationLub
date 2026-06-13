<template>
    <div class="container row">
        <form class="container py-3 col-md-5 offset-md-1" @submit.prevent="submit">
            <h2>Creation manufacturer</h2>
            <div class="mb-3">
                <label class="form-label">Nom</label>
                <input v-model="form.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
                <label class="form-label">Commentaire</label>
                <textarea v-model="form.comment" class="form-control"></textarea>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Enregistrer</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createManufacturer } from '../../../services/dropDown.js';

const router = useRouter();
const form = ref({
  name: '',
  comment: ''
});

const submit = async () => {
  try {
    await createManufacturer(form.value);
    router.push('/dropdown/manufacturer');
  } catch (error) {
    console.error(error);
  }
};
</script>