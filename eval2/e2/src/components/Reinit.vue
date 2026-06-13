<template>
    <div class="reinit-container">
        <h1>⚠️ Réinitialisation des données ⚠️</h1>
        <p class="warning-text">Cette action supprimera tous les tickets, actifs, modèles, types, fabricants, lieux et états existants.</p>
        
        <button class="btn-danger reinit-btn" @click="handleReinit" :disabled="loading">
            {{ loading ? 'Réinitialisation en cours...' : 'Réinitialiser toutes les données' }}
        </button>

        <div v-if="report" class="report-card">
            <h2>Rapport de Réinitialisation</h2>
            <ul>
                <li><strong>Tickets supprimés:</strong> {{ report.tickets }}</li>
                <li><strong>Actifs supprimés:</strong> {{ report.assets }}</li>
                <li><strong>Modèles supprimés:</strong> {{ report.models }}</li>
                <li><strong>Types supprimés:</strong> {{ report.types }}</li>
                <li><strong>Fabricants supprimés:</strong> {{ report.manufacturers }}</li>
                <li><strong>Lieux supprimés:</strong> {{ report.locations }}</li>
                <li><strong>Statuts supprimés:</strong> {{ report.states }}</li>
            </ul>
            
            <div v-if="report.errors && report.errors.length" class="errors-section">
                <h3>Erreurs ({{ report.errors.length }})</h3>
                <ul class="error-list">
                    <li v-for="(err, index) in report.errors" :key="index">{{ err }}</li>
                </ul>
            </div>
            
            <div v-else class="success-msg">
                <p>✅ Tout a été supprimé sans erreur.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { resetAll } from '../services/reset'

const loading = ref(false)
const report = ref(null)

async function handleReinit() {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser les données ? Cette action est irréversible.')) {
        return
    }
    
    loading.value = true
    report.value = null
    
    try {
        const res = await resetAll()
        report.value = res
        alert('Opération terminée ! Consultez le rapport.')
    } catch (error) {
        console.error('Erreur lors de la réinitialisation :', error)
        alert('Une erreur fatale est survenue.')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.reinit-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ffcccc;
    border-radius: 8px;
    background-color: #fff9f9;
    text-align: center;
}

.warning-text {
    color: #cc0000;
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.reinit-btn {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.reinit-btn:hover:not(:disabled) {
    background-color: #c82333;
}

.reinit-btn:disabled {
    background-color: #e49199;
    cursor: not-allowed;
}

.report-card {
    margin-top: 2rem;
    text-align: left;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.report-card h2 {
    margin-top: 0;
    color: #333;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
}

.report-card ul {
    list-style-type: none;
    padding: 0;
}

.report-card li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f1f1;
}

.errors-section {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #ffe6e6;
    border-left: 4px solid #dc3545;
}

.error-list {
    max-height: 200px;
    overflow-y: auto;
    color: #b30000;
    font-size: 0.9em;
}

.success-msg {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #e6ffe6;
    color: #006600;
    border-left: 4px solid #28a745;
    font-weight: bold;
}
</style>