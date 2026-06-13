<script setup lang="ts">
import { ref } from 'vue';
import router from '../router.js';
import { getAccessToken, getSession } from '../util.js';
import DashboardItemList from './item/DashboardItemList.vue';
import DashboardTicketList from './ticket/DashboardTicketList.vue';

const token = ref(getAccessToken() || '');
const session = ref(getSession() || null);
const copied = ref(false);

const copyToken = async () => {
    try {
        await navigator.clipboard.writeText(token.value);
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
    } catch (err) {
        console.error('Failed to copy', err);
    }
};
const copySession = async () => {
    try {
        const sessionData = JSON.stringify(session.value);
        await navigator.clipboard.writeText(sessionData);
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
    } catch (err) {
        console.error('Failed to copy', err);
    }
};
</script>
<template>
    <div class="container py-3">
        <button class="btn btn-success mb-3" @click="router.push({ path: '/fo/ticket'})">Listes tickets</button>
        <div class="mb-4">
            <label class="form-label fw-bold">Session</label>
            <div class="input-group">
                <input type="text" class="form-control" :value="session" readonly>
                <button class="btn btn-outline-primary" type="button" @click="copySession" title="Copier la session">
                    <i :class="copied ? 'ti ti-check text-success' : 'ti ti-copy'"></i> {{ copied ? 'Copié !' : 'Copier' }}
                </button>
            </div>
        </div>
        <div class="mb-4">
            <label class="form-label fw-bold">Access Token</label>
            <div class="input-group">
                <input type="text" class="form-control" :value="token" readonly>
                <button class="btn btn-outline-primary" type="button" @click="copyToken" title="Copier le token">
                    <i :class="copied ? 'ti ti-check text-success' : 'ti ti-copy'"></i> {{ copied ? 'Copié !' : 'Copier' }}
                </button>
            </div>
        </div>
    </div>
    <DashboardItemList/>
    <DashboardTicketList/>
</template>