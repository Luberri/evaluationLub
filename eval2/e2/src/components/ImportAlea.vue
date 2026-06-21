<template>
  <div class="container py-4" style="max-width: 520px;">
    <h5 class="mb-3">Import CSV — Aléa</h5>

    <!-- Import fichier -->
    <input type="file" accept=".csv" class="form-control mb-3" @change="e => loadFile(e.target.files[0])" />

    <!-- Saisie manuelle -->
    <div class="card mb-3">
      <div class="card-body">
        <h6 class="mb-3">Saisie manuelle</h6>
        <div class="mb-2">
          <label class="form-label small">Ticket</label>
          <input v-model="form.ticket" type="text" class="form-control form-control-sm" />
        </div>
        <div class="mb-2">
          <label class="form-label small">Mouvement</label>
          <select v-model="form.mvt" class="form-select form-select-sm">
            <option value="">-- choisir --</option>
            <option value="open">open | reouverture</option>
            <option value="close">close | terminer</option>
            <option value="cancel">cancel | supp farany</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label small">Valeur</label>
          <input v-model="form.valeur" type="number" class="form-control form-control-sm" />
        </div>
        <!-- <div class="mb-3">
          <label class="form-label small">Mode</label>
          <input v-model="form.mode" type="number" class="form-control form-control-sm" />
        </div> -->
        <select v-model="form.mode" class="form-select form-select-sm mb-3">
            <option value="1">1 | farany</option>
            <option value="2">2 | voalohany</option>
            <option value="3">3 | moyenne</option>
            <option value="4">4 | somme</option>
        </select>
        <button class="btn btn-sm btn-outline-primary" :disabled="!form.ticket || !form.mvt || loadingManuel" @click="handleManuel">
          <span v-if="loadingManuel" class="spinner-border spinner-border-sm me-1"></span>
          Traiter
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>
    <div v-if="success" class="alert alert-success py-2 small">{{ success }}</div>

    <button class="btn btn-primary" :disabled="!file || loading" @click="handleImport">
      <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
      {{ loading ? 'Importation...' : 'Importer' }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { importCSVAlea, traiter } from '../services/ImportAlea'
// import { traiter } from '../services/traiter'

const file = ref(null)
const loading = ref(false)
const loadingManuel = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({ ticket: '', mvt: '', valeur: 0 ,mode: 1})

function loadFile(f) {
  if (!f?.name.endsWith('.csv')) return (error.value = 'Fichier .csv requis')
  file.value = f
  error.value = ''
  success.value = ''
}

async function handleManuel() {
  loadingManuel.value = true
  error.value = ''
  success.value = ''
  try {
    await traiter(form.ticket, form.mvt, form.valeur,form.mode)
    success.value = `Traitement "${form.mvt}" effectué pour le ticket ${form.ticket}.`
    Object.assign(form, { ticket: '', mvt: '', valeur: 0 ,mode:1})
  } catch (err) {
    // error.value = err.message || 'Erreur traitement'
  } finally {
    loadingManuel.value = false
  }
}

async function handleImport() {
  loading.value = true
  error.value = ''
  try {
    const result = await importCSVAlea(await file.value.text())
    success.value = `${result.createdCount} ligne(s) créée(s).`
    file.value = null
  } catch (err) {
    // error.value = err.message || 'Erreur import'
  } finally {
    loading.value = false
  }
}
</script>