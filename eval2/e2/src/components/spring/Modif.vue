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
    await updateReouv(c.id, c.idTicket, formData, c.mode)
    load()
}
async function ModifierCout(c) {
    const formData = { coutSuper: c.coutSuper }
    await updateCout(c.id, formData)
    load()
}
async function Sup(c) {
    await updateCoutSpring(c.id, {
        idTicket: c.idTicket,
        groupe: c.groupe,
        coutSuper: 0,
        itemType: null,
        motif: c.motif
    })
}
</script>

<template>
    <div class="page">
        <div class="page-header">
            <span class="page-count">{{ all.length }} entrées</span>
            <h1>Réouverture & coût</h1>
        </div>

        <div class="list">
            <div v-for="c in all" :key="c.id" class="card" :class="c.motif === 'reouv' ? 'card--reouv' : 'card--cout'">

                <div class="card-meta">
                    <span class="meta-id">#{{ c.id }}</span>
                    <span class="meta-ticket">ticket {{ c.idTicket }}</span>
                    <span class="badge" :class="c.motif === 'reouv' ? 'badge--dark' : 'badge--light'">{{ c.motif }}</span>
                </div>

                <div class="card-body">
                    <div class="field">
                        <label>Coût super</label>
                        <input type="number" v-model="c.coutSuper" />
                    </div>

                    <template v-if="c.motif === 'reouv'">
                        <div class="field">
                            <label>Pourcentage</label>
                            <div class="input-unit">
                                <input type="number" v-model="c.pourc" />
                                <span>%</span>
                            </div>
                        </div>
                        <div class="field">
                            <label>Mode</label>
                            <input type="number" v-model="c.mode" />
                        </div>
                        <div class="card-actions">
                            <button @click="Modifier(c)">Modifier</button>
                        </div>
                    </template>

                    <template v-else>
                        <div class="card-actions">
                            <button @click="ModifierCout(c)">Modifier coût</button>
                        </div>
                    </template>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    padding: 32px 36px;
    max-width: 860px;
}

.page-header {
    margin-bottom: 28px;
}

h1 {
    font-size: 20px;
    font-weight: 500;
    color: var(--text-main, #0a0a0a);
    letter-spacing: -0.3px;
    margin: 0;
}

.page-count {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-hint, #999);
    margin-bottom: 4px;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card {
    background: #fff;
    border: 0.5px solid #e5e5e5;
    border-radius: 2px;
    overflow: hidden;
}

.card--reouv {
    border-left: 2px solid #0a0a0a;
}

.card--cout {
    border-left: 2px solid #d0d0d0;
}

.card-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-bottom: 0.5px solid #f0f0f0;
    background: #fafafa;
}

.meta-id {
    font-size: 11px;
    font-weight: 600;
    color: #0a0a0a;
    font-variant-numeric: tabular-nums;
}

.meta-ticket {
    font-size: 11px;
    color: #999;
}

.badge {
    margin-left: auto;
    padding: 2px 9px;
    border-radius: 2px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
}

.badge--dark {
    background: #0a0a0a;
    color: #fff;
}

.badge--light {
    background: #efefef;
    color: #666;
}

.card-body {
    padding: 14px 16px;
    display: flex;
    align-items: flex-end;
    gap: 20px;
    flex-wrap: wrap;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.field label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #999;
}

.field input[type="number"] {
    padding: 7px 10px;
    border: 0.5px solid #e5e5e5;
    border-radius: 2px;
    width: 100px;
    font-size: 13px;
    font-family: inherit;
    color: #0a0a0a;
    background: #fff;
    outline: none;
    transition: border-color 0.1s;
}

.field input[type="number"]:focus {
    border-color: #0a0a0a;
}

.input-unit {
    display: flex;
    align-items: center;
    gap: 0;
    border: 0.5px solid #e5e5e5;
    border-radius: 2px;
    overflow: hidden;
    width: 100px;
}

.input-unit input[type="number"] {
    border: none;
    border-radius: 0;
    width: 100%;
    padding: 7px 8px;
}

.input-unit span {
    padding: 0 8px;
    font-size: 12px;
    color: #999;
    background: #f7f7f5;
    border-left: 0.5px solid #e5e5e5;
    align-self: stretch;
    display: flex;
    align-items: center;
}

.card-actions {
    margin-left: auto;
    align-self: flex-end;
}

button {
    padding: 7px 18px;
    border: 0.5px solid #0a0a0a;
    border-radius: 2px;
    background: #0a0a0a;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
    white-space: nowrap;
}

button:hover {
    background: #fff;
    color: #0a0a0a;
}
</style>