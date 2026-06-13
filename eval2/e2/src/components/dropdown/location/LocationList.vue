<template>
  <div class="container py-3">
    <div class="d-flex gap-3 mb-3">
        <h1 class="mb-1">Liste des locations</h1>
        <button class="btn btn-primary" @click="router.push('/dropdown/location/create')">
            Creer location
        </button>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Complete Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.completename }}</td>
          <td>
            <button @click="router.push(`/dropdown/location/detail/${item.id}`)" class="btn btn-info btn-sm me-2">Detail</button>
            <button @click="remove(item.id)" class="btn btn-danger btn-sm">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllLocations, supLocation } from '../../../services/dropDown.js';

const router = useRouter();

const items = ref([]);

const load = async () => {
  try {
    const res = await getAllLocations();
    items.value = res.data || res;
  } catch (error) {
    console.error(error);
  }
};

const remove = async (id) => {
  if (confirm('Are you sure?')) {
    try {
      await supLocation(id);
      load();
    } catch (error) {
      console.error(error);
    }
  }
};

onMounted(() => {
  load();
});
</script>