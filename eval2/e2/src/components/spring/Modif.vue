<script setup>
import { onMounted, ref } from 'vue';
import { getAllCoutSpring } from '../../services/spring';

const all = ref([])
onMounted(async () => {
    all.value = (await getAllCoutSpring)
})
</script>
<template>
    <h1>reouverture et cout</h1>
    <table>
        <thead>
            <th></th>
            <th></th>
            <th></th>
        </thead>
    </table>
</template>