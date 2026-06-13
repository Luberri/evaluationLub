<template>
    <div class="container py-4">
        <h1>Import Groupé</h1>

        <div class="row g-4 mb-4">
            <!-- Zone Import 1 (Éléments) -->
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-white border-bottom">
                        <h5 class="mb-0">
                            <i class="ti ti-file-upload me-2 text-primary"></i>
                            1. Import Éléments
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="drop-zone border rounded-3 text-center p-4 mb-3"
                            :class="{ 'drop-zone--active': isDragging1 }" @dragover.prevent="isDragging1 = true"
                            @dragleave="isDragging1 = false" @drop.prevent="onDrop1" @click="$refs.fileInput1.click()">
                            <input ref="fileInput1" type="file" accept=".csv" class="d-none"
                                @change="onFileChange($event, 1)" />
                            <div v-if="!file1">
                                <i class="ti ti-cloud-upload fs-1 text-secondary mb-3 d-block"></i>
                                <p class="mb-1 fw-medium">Glissez un fichier CSV ici</p>
                            </div>
                            <div v-else class="d-flex align-items-center justify-content-center gap-2">
                                <i class="ti ti-file-text text-primary fs-5"></i>
                                <span class="fw-medium">{{ file1.name }}</span>
                                <button class="btn btn-sm btn-link text-danger p-0 ms-2" @click.stop="file1 = null">
                                    <i class="ti ti-x"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Affichage du retour 1 -->
                        <div v-if="result1" class="alert alert-info py-2 px-3 mb-0">
                            <div class="fw-bold fs-6 mb-1">Résultat Éléments :</div>
                            <div style="max-height: 120px; overflow-y: auto;" class="small">
                                <div v-for="res in result1" :key="res.id">
                                    ID: {{ res.id }} - Nom: {{ res.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Zone Import 2 (Tickets) -->
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-white border-bottom">
                        <h5 class="mb-0">
                            <i class="ti ti-file-upload me-2 text-primary"></i>
                            2. Import Tickets
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="drop-zone border rounded-3 text-center p-4 mb-3"
                            :class="{ 'drop-zone--active': isDragging2 }" @dragover.prevent="isDragging2 = true"
                            @dragleave="isDragging2 = false" @drop.prevent="onDrop2" @click="$refs.fileInput2.click()">
                            <input ref="fileInput2" type="file" accept=".csv" class="d-none"
                                @change="onFileChange($event, 2)" />
                            <div v-if="!file2">
                                <i class="ti ti-cloud-upload fs-1 text-secondary mb-3 d-block"></i>
                                <p class="mb-1 fw-medium">Glissez un fichier CSV ici</p>
                            </div>
                            <div v-else class="d-flex align-items-center justify-content-center gap-2">
                                <i class="ti ti-file-text text-primary fs-5"></i>
                                <span class="fw-medium">{{ file2.name }}</span>
                                <button class="btn btn-sm btn-link text-danger p-0 ms-2" @click.stop="file2 = null">
                                    <i class="ti ti-x"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Affichage du retour 2 -->
                        <div v-if="result2" class="alert alert-success py-2 px-3 mb-0">
                            <div class="fw-bold fs-6 mb-1">Résultat Tickets :</div>
                            <div class="small">Import terminé : {{ result2.length }} ticket(s) traité(s).</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4 mb-4">
            <!-- Zone Import 3 (Coûts) -->
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-white border-bottom">
                        <h5 class="mb-0">
                            <i class="ti ti-file-upload me-2 text-primary"></i>
                            3. Import Coûts
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="drop-zone border rounded-3 text-center p-4 mb-3"
                            :class="{ 'drop-zone--active': isDragging3 }" @dragover.prevent="isDragging3 = true"
                            @dragleave="isDragging3 = false" @drop.prevent="onDrop3" @click="$refs.fileInput3.click()">
                            <input ref="fileInput3" type="file" accept=".csv" class="d-none"
                                @change="onFileChange($event, 3)" />
                            <div v-if="!file3">
                                <i class="ti ti-cloud-upload fs-1 text-secondary mb-3 d-block"></i>
                                <p class="mb-1 fw-medium">Glissez un fichier CSV ici</p>
                            </div>
                            <div v-else class="d-flex align-items-center justify-content-center gap-2">
                                <i class="ti ti-file-text text-primary fs-5"></i>
                                <span class="fw-medium">{{ file3.name }}</span>
                                <button class="btn btn-sm btn-link text-danger p-0 ms-2" @click.stop="file3 = null">
                                    <i class="ti ti-x"></i>
                                </button>
                            </div>
                        </div>

                        <div v-if="result3" class="alert alert-warning py-2 px-3 mb-0">
                            <div class="fw-bold fs-6 mb-1">Résultat Coûts :</div>
                            <div class="small">Import terminé : {{ result3.length }} ligne(s) traitée(s).</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Zone Import Images (facultatif) -->
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-white border-bottom">
                        <h5 class="mb-0">
                            <i class="ti ti-photo-up me-2 text-primary"></i>
                            4. Import Images
                            <span class="badge bg-secondary ms-2 fw-normal" style="font-size: 0.7rem;">Facultatif</span>
                        </h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted small mb-2">
                            ZIP contenant les images nommées <code>nom_asset.ext</code>.
                            Lancé en parallèle après l'import des éléments.
                        </p>
                        <div class="drop-zone border rounded-3 text-center p-4 mb-3"
                            :class="{ 'drop-zone--active': isDraggingImg }"
                            @dragover.prevent="isDraggingImg = true"
                            @dragleave="isDraggingImg = false"
                            @drop.prevent="onDropImg"
                            @click="$refs.fileInputImg.click()">
                            <input ref="fileInputImg" type="file" accept=".zip" class="d-none"
                                @change="onFileChange($event, 'img')" />
                            <div v-if="!fileImg">
                                <i class="ti ti-cloud-upload fs-1 text-secondary mb-3 d-block"></i>
                                <p class="mb-1 fw-medium">Glissez un fichier ZIP ici</p>
                            </div>
                            <div v-else class="d-flex align-items-center justify-content-center gap-2">
                                <i class="ti ti-file-zip text-primary fs-5"></i>
                                <span class="fw-medium">{{ fileImg.name }}</span>
                                <button class="btn btn-sm btn-link text-danger p-0 ms-2" @click.stop="fileImg = null">
                                    <i class="ti ti-x"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Statut images : en cours -->
                        <div v-if="imageStatus === 'running'" class="alert alert-secondary py-2 px-3 mb-0 d-flex align-items-center gap-2">
                            <span class="spinner-border spinner-border-sm text-primary"></span>
                            <span class="small">Import images en cours…</span>
                        </div>

                        <!-- Statut images : terminé -->
                        <div v-else-if="imageStatus === 'done'" class="alert py-2 px-3 mb-0"
                            :class="imageErrors > 0 ? 'alert-warning' : 'alert-success'">
                            <div class="fw-bold fs-6 mb-1">Résultat Images :</div>
                            <div class="small">
                                {{ imageOk }} image(s) uploadée(s)
                                <span v-if="imageErrors > 0" class="text-danger ms-1">
                                    · {{ imageErrors }} erreur(s)
                                </span>
                            </div>
                        </div>

                        <!-- Statut images : erreur fatale -->
                        <div v-else-if="imageStatus === 'error'" class="alert alert-danger py-2 px-3 mb-0">
                            <div class="fw-bold fs-6 mb-1">Erreur import images :</div>
                            <div class="small">{{ imageError }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 py-2">
            <i class="ti ti-alert-circle"></i>
            <span>{{ error }}</span>
        </div>

        <!-- Bouton importer tous -->
        <div class="d-flex justify-content-end mb-5">
            <button class="btn btn-primary px-4" :disabled="!isImportValid || loading" @click="handleImportAll">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="ti ti-upload me-2"></i>
                {{ loading ? stepMessage : importLabel }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { importCSV } from '../services/import1'
import { importTicketsCSV } from '../services/import2'
import { importCostsCV } from '../services/import3'
import { importImages } from '../services/importImg'

// ─── Fichiers CSV ─────────────────────────────────────────────────────────────

const fileInput1 = ref(null)
const file1 = ref(null)
const isDragging1 = ref(false)

const fileInput2 = ref(null)
const file2 = ref(null)
const isDragging2 = ref(false)

const fileInput3 = ref(null)
const file3 = ref(null)
const isDragging3 = ref(false)

// ─── Fichier ZIP images (facultatif) ─────────────────────────────────────────

const fileInputImg = ref(null)
const fileImg = ref(null)
const isDraggingImg = ref(false)

/** 'idle' | 'running' | 'done' | 'error' */
const imageStatus = ref('idle')
const imageOk = ref(0)
const imageErrors = ref(0)
const imageError = ref('')

// ─── État global ──────────────────────────────────────────────────────────────

const loading = ref(false)
const error = ref('')
const stepMessage = ref('')

const result1 = ref(null)
const result2 = ref(null)
const result3 = ref(null)

// ─── Computed ─────────────────────────────────────────────────────────────────

const hasFile1 = computed(() => Boolean(file1.value))
const hasFile2 = computed(() => Boolean(file2.value))
const hasFile3 = computed(() => Boolean(file3.value))

const importSteps = computed(() => {
    if (hasFile1.value && !hasFile2.value && !hasFile3.value) return ['import1']
    if (hasFile1.value && hasFile2.value && !hasFile3.value) return ['import1', 'import2']
    if (hasFile1.value && hasFile2.value && hasFile3.value) return ['import1', 'import2', 'import3']
    return []
})

const importLabel = computed(() => {
    if (!importSteps.value.length) return 'Sélectionnez les fichiers requis'
    const steps = [...importSteps.value]
    if (fileImg.value) steps.push('images')
    return `Importer : ${steps.join(' → ')}`
})

const isImportValid = computed(() => importSteps.value.length > 0)

// ─── Handlers fichiers ────────────────────────────────────────────────────────

function onFileChange(e, type) {
    const selected = e.target.files[0]
    if (!selected) return
    if (type === 1) file1.value = selected
    else if (type === 2) file2.value = selected
    else if (type === 3) file3.value = selected
    else if (type === 'img') fileImg.value = selected
}

function onDrop1(e) {
    isDragging1.value = false
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.csv')) file1.value = f
}
function onDrop2(e) {
    isDragging2.value = false
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.csv')) file2.value = f
}
function onDrop3(e) {
    isDragging3.value = false
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.csv')) file3.value = f
}
function onDropImg(e) {
    isDraggingImg.value = false
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.zip')) fileImg.value = f
}

// ─── Import principal ─────────────────────────────────────────────────────────

async function handleImportAll() {
    if (!isImportValid.value) {
        error.value = "Combinaison de fichiers invalide."
        return
    }

    loading.value = true
    error.value = ''
    result1.value = null
    result2.value = null
    result3.value = null
    imageStatus.value = 'idle'
    imageOk.value = 0
    imageErrors.value = 0
    imageError.value = ''

    try {
        // ── Étape 1 : Import éléments ─────────────────────────────────────────
        stepMessage.value = '1/3 : Importation des éléments…'
        const text1 = await file1.value.text()
        result1.value = await importCSV(text1)
        // result1 = [{ id, name, itemtype }] ← argument de importImages

        // ── Lancement parallèle des images dès que result1 est prêt ──────────
        // On ne await pas ici : l'import image tourne en fond, indépendant de 2 et 3
        let imagePromise = null
        if (fileImg.value) {
            imageStatus.value = 'running'
            imagePromise = importImages(fileImg.value, result1.value)
                .then((results) => {
                    imageOk.value     = results.filter(r => r.status === 'ok').length
                    imageErrors.value = results.filter(r => r.status === 'error').length
                    imageStatus.value = 'done'
                })
                .catch((err) => {
                    imageError.value  = err.message || 'Erreur inconnue'
                    imageStatus.value = 'error'
                })
        }

        // ── Étape 2 : Import tickets ──────────────────────────────────────────
        if (importSteps.value.includes('import2')) {
            stepMessage.value = '2/3 : Importation des tickets…'
            const text2 = await file2.value.text()
            result2.value = await importTicketsCSV(text2, result1.value)
        }

        // ── Étape 3 : Import coûts ────────────────────────────────────────────
        if (importSteps.value.includes('import3')) {
            if (!result2.value) throw new Error("Import 3 nécessite d'abord l'import 2.")
            stepMessage.value = '3/3 : Importation des coûts…'
            const text3 = await file3.value.text()
            result3.value = await importCostsCV(text3, result2.value)
        }

        // ── Attente finale des images si toujours en cours ────────────────────
        // (les étapes 2/3 sont terminées, on attend la fin pour ne pas quitter
        //  le loading avant que le statut image soit résolu)
        if (imagePromise) await imagePromise

    } catch (err) {
        error.value = err.message || 'Une erreur est survenue lors de l\'import.'
    } finally {
        loading.value = false
        stepMessage.value = ''
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