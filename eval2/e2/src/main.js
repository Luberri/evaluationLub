import { createApp } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import App from './App.vue'
import router from './router'
import '@tabler/icons-webfont/dist/tabler-icons.css'
import { initSession, initTocken, setSession, setAccessToken } from './util'

async function init() {
    try {
        // const a = await initSession()
        // const b = await initTocken()
        // setSession(a.data.session_token)
        // setAccessToken(b.data.access_token)
    } catch (e) {
        console.error('Erreur lors de l\'initialisation', e)
    }
    createApp(App).use(router).mount('#app')
}

init()
