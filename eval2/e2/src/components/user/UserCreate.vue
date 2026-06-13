<script setup>
import { inject, reactive } from 'vue'
import { createUser } from '../../services/user'

const formData = reactive({
	username: '',
	firstname: '',
	realname: '',
	password: '',
	password2: '',
	is_active: true,
	authtype: 1
})

async function handleCreation() {
	try {
		const payload = {
			username: String(formData.username),
			firstname: String(formData.firstname),
			realname: String(formData.realname),
			password: String(formData.password),
			password2: String(formData.password2),
			is_active: Boolean(formData.is_active),
			authtype: Number(formData.authtype)
		}
		const response = await createUser(payload)
	} catch (error) {
		console.error('Erreur creation utilisateur:', error)
	}
}
</script>

<template>
	<h1>Creation utilisateur</h1>
	<form class="container py-3" @submit.prevent="handleCreation">
		<div class="mb-3">
			<label class="form-label">Username</label>
			<input type="text" class="form-control" v-model="formData.username">
		</div>
		<div class="mb-3">
			<label class="form-label">Firstname</label>
			<input type="text" class="form-control" v-model="formData.firstname">
		</div>
		<div class="mb-3">
			<label class="form-label">Realname</label>
			<input type="text" class="form-control" v-model="formData.realname">
		</div>
		<div class="mb-3">
			<label class="form-label">Password</label>
			<input type="password" class="form-control" v-model="formData.password">
		</div>
		<div class="mb-3">
			<label class="form-label">Password confirmation</label>
			<input type="password" class="form-control" v-model="formData.password2">
		</div>
		<div class="mb-3">
			<label class="form-label">Active</label>
			<select class="form-select" v-model="formData.is_active">
				<option :value="true">true</option>
				<option :value="false">false</option>
			</select>
		</div>
		<div class="mb-3">
			<label class="form-label">Auth type</label>
			<input type="number" class="form-control" v-model="formData.authtype">
		</div>
		<button role="submit" class="btn btn-primary">Creer</button>
	</form>
</template>
