<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAllUser } from '../../services/user'

const router = useRouter()
const users = ref([])
const search = ref('')

const filteredUsers = computed(() => {
	const term = search.value.trim().toLowerCase()

	if (!term) return users.value

	return users.value.filter((user) => {
		const fields = [
			user?.id,
			user?.username,
			user?.firstname,
			user?.realname,
			user?.authtype,
			user?.is_active ? 'active' : 'inactive',
		]

		return fields.some((field) => String(field ?? '').toLowerCase().includes(term))
	})
})

async function loadUsers() {
	try {
		const response = await getAllUser()
		users.value = Array.isArray(response?.data) ? response.data : []
	} catch (err) {
		console.error('Erreur chargement utilisateurs:', err)
	}
}

function goCreateUser() {
	router.push('/bo/user/create')
}

function formatBoolean(value) {
	return value ? 'Oui' : 'Non'
}

onMounted(loadUsers)
</script>

<template>
	<div class="container py-3">
		<div class="d-flex gap-3 mb-3">
			<h1 class="mb-1">Liste des utilisateurs</h1>
			<button class="btn btn-primary" @click="goCreateUser">
				Créer un utilisateur
			</button>
		</div>

		<div class="row g-3 mb-3">
			<div class="col-12 col-lg-6">
				<input
					v-model="search"
					type="search"
					class="form-control"
				>
			</div>

		</div>

		<div class="table-responsive">
			<table class="table table-striped align-middle">
				<thead>
					<tr>
						<th scope="col">ID</th>
						<th scope="col">Username</th>
						<th scope="col">Prénom</th>
						<th scope="col">Nom</th>
						<th scope="col">Actif</th>
						<th scope="col">Auth type</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="user in filteredUsers" :key="user.id">
						<td>{{ user.id }}</td>
						<td>{{ user.username }}</td>
						<td>{{ user.firstname }}</td>
						<td>{{ user.realname }}</td>
						<td>{{ formatBoolean(user.is_active) }}</td>
						<td>{{ user.authtype }}</td>
					</tr>
					<tr v-if="!filteredUsers.length">
						<td colspan="6" class="text-center text-muted py-4">
							Aucun utilisateur trouvé.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

