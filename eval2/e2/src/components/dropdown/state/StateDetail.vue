<template>
    <div class="container row" v-if="form">
        <form class="container py-3 col-md-5 offset-md-1" @submit.prevent="submit">
            <h2>Detail state</h2>
            <div class="mb-3">
                <label class="form-label">Nom</label>
                <input v-model="form.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
                <label class="form-label">Commentaire</label>
                <textarea v-model="form.comment" class="form-control"></textarea>
            </div>
            <div class="mb-3 form-check">
                <input v-model="form.is_recursive" type="checkbox" class="form-check-input" id="is_recursive" />
                <label class="form-check-label" for="is_recursive">Is Recursive</label>
            </div>
            <div class="mb-3 form-check">
                <input v-model="form.is_visible_helpdesk" type="checkbox" class="form-check-input" id="is_visible_helpdesk" />
                <label class="form-check-label" for="is_visible_helpdesk">Is Visible Helpdesk</label>
            </div>
            <h4>Visibilities</h4>
            <div class="row">
                <div class="col-md-6" v-for="(val, key) in form.visibilities" :key="key">
                    <div class="form-check">
                        <input v-model="form.visibilities[key]" type="checkbox" class="form-check-input" :id="'vis_'+key" />
                        <label class="form-check-label" :for="'vis_'+key">{{ key }}</label>
                    </div>
                </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Modifier</button>
            <button type="button" @click="router.push('/dropdown/state')" class="btn btn-secondary mt-3 ms-2">Retour</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getState, updateState } from '../../../services/dropDown.js';

const route = useRoute();
const router = useRouter();
const form = ref(null);

onMounted(async () => {
  try {
    const res = await getState(route.params.id);
    form.value = res.data || res;
    if (!form.value.visibilities) {
      form.value.visibilities = {};
    }
  } catch (error) {
    console.error(error);
  }
});

const submit = async () => {
  try {
    await updateState(route.params.id, form.value);
    router.push('/dropdown/state');
  } catch (error) {
    console.error(error);
  }
};
</script>