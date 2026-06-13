<template>
    <div class="container py-4">
        <h1>Import ticket</h1>
        <div class="card shadow-sm">
            <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                    <i class="ti ti-file-upload me-2 text-primary"></i>
                    Import CSV
                </h5>
            </div>

            <div class="card-body">
                <!-- Zone de drop -->
                <div
                    class="drop-zone border rounded-3 text-center p-5 mb-4"
                    :class="{ 'drop-zone--active': isDragging, 'border-danger': error }"
                    @dragover.prevent="isDragging = true"
                    @dragleave="isDragging = false"
                    @drop.prevent="onDrop"
                    @click="$refs.fileInput.click()"
                >
                    <input
                        ref="fileInput"
                        type="file"
                        accept=".csv"
                        class="d-none"
                        @change="onFileChange"
                    />

                    <div v-if="!file">
                        <i class="ti ti-cloud-upload fs-1 text-secondary mb-3 d-block"></i>
                        <p class="mb-1 fw-medium">Glissez un fichier CSV ici</p>
                        <p class="text-muted small mb-0">ou cliquez pour parcourir</p>
                    </div>

                    <div v-else class="d-flex align-items-center justify-content-center gap-2">
                        <i class="ti ti-file-text text-primary fs-5"></i>
                        <span class="fw-medium">{{ file.name }}</span>
                        <span class="text-muted small">({{ fileSize }})</span>
                        <button
                            class="btn btn-sm btn-link text-danger p-0 ms-2"
                            @click.stop="resetFile"
                        >
                            <i class="ti ti-x"></i>
                        </button>
                    </div>
                </div>

                <!-- Erreur -->
                <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 py-2">
                    <i class="ti ti-alert-circle"></i>
                    <span>{{ error }}</span>
                </div>

                <!-- Succès -->
                <div v-if="success" class="alert alert-success d-flex align-items-center gap-2 py-2">
                    <i class="ti ti-circle-check"></i>
                    <span>{{ success }}</span>
                </div>

                <!-- Bouton import -->
                <div class="d-flex justify-content-end">
                    <button
                        class="btn btn-primary px-4"
                        :disabled="!file || loading"
                        @click="handleImport"
                    >
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="ti ti-upload me-2"></i>
                        {{ loading ? 'Importation...' : 'Lancer l\'import' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { importTicketsCSV } from '../services/import2'

const fileInput = ref(null)
const file = ref(null)
const isDragging = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')
const detectedColumns = ref([])

const requiredColumns = ['name', 'status', 'location', 'manufacturer', 'item_type', 'model', 'iventory_number', 'user']

const fileSize = computed(() => {
    if (!file.value) return ''
    const kb = file.value.size / 1024
    return kb < 1024 ? `${kb.toFixed(1)} Ko` : `${(kb / 1024).toFixed(1)} Mo`
})

function onFileChange(e) {
    const selected = e.target.files[0]
    if (selected) loadFile(selected)
}

function onDrop(e) {
    isDragging.value = false
    const dropped = e.dataTransfer.files[0]
    if (dropped?.name.endsWith('.csv')) {
        loadFile(dropped)
    } else {
        error.value = 'Veuillez déposer un fichier .csv'
    }
}

function loadFile(f) {
    file.value = f
    error.value = ''
    success.value = ''

    // Lire les colonnes pour preview
    const reader = new FileReader()
    reader.onload = (e) => {
        const firstLine = e.target.result.split('\n')[0]
        detectedColumns.value = firstLine.split(',').map(c => c.trim().replace(/"/g, ''))
    }
    reader.readAsText(f)
}

function resetFile() {
    file.value = null
    detectedColumns.value = []
    error.value = ''
    success.value = ''
    if (fileInput.value) fileInput.value.value = ''
}

async function handleImport() {
    if (!file.value) return
    loading.value = true
    error.value = ''
    success.value = ''

    try {
        const text = await file.value.text()
        await importTicketsCSV(text)
        success.value = 'Import terminé avec succès !'
        resetFile()
    } catch (err) {
        error.value = err.message || 'Une erreur est survenue.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.drop-zone {
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    border-style: dashed !important;
    border-color: #dee2e6;
}
.drop-zone:hover,
.drop-zone--active {
    background: #f0f4ff;
    border-color: #0d6efd !important;
}
</style>