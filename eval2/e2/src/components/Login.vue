<script setup>
import { setAccessToken, setSession,initSession,initTocken } from "../util";
import { useRouter } from "vue-router"

const router = useRouter()

async function test() {
    const a = await initSession()
    const b = await initTocken()
    console.log('initTocken ',b.data)
    setSession(a.data.session_token)
    setAccessToken(b.data.access_token)
    router.push({ path: "/bo/dashboard"})
}
</script>
<template>
    <div class="container">
        <h1>Initier session</h1>
        <button class="btn btn-primary" @click="test()">Init session</button>
    </div>
</template>