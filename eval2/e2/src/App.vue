<script setup>
import { ref, provide, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { setGlobalMessageHandler } from "./util";

const message = ref("");
const error = ref(false);
const route = useRoute();
const router = useRouter();

function setMessage(text, isError = false) {
  message.value = text;
  error.value = isError;
  setTimeout(() => { message.value = ""; error.value = false; }, 7000);
}

provide("setMessage", setMessage);
setGlobalMessageHandler(setMessage);

const loginPaths = ["/", "/bo"];
const isAuthenticated = computed(() => !loginPaths.includes(route.path));

const navGroups = [
  {
    label: "Général",
    items: [
      { label: "Dashboard", icon: "ti-layout-dashboard", path: "/bo/dashboard" },
      { label: "Reset all", icon: "ti ti-refresh", path: "/bo/reset" },
      { label: "Gesion Kanban", icon: "ti-layout-kanban", path: "/bo/spring/status" },
      { label: "Detail Glpi+Detail Super", icon: "ti-file-description", path: "/bo/alea1" }
    ],
  },
  {
    label: "Tickets",
    items: [
      { label: "Liste des tickets", icon: "ti-list", path: "/fo/ticket" },
      { label: "Créer un ticket",   icon: "ti-circle-plus", path: "/fo/ticket/create" },
      { label: "Kanban", icon: "ti-layout-kanban", path: "/fo/kanban" },
    ],
  },
  {
    label: "Element",
    items: [
      { label: "Elements",        icon: "ti-package",          path: "/fo/item" },
      { label: "Liste element", icon: "ti-file-description", path: "/fo/item/detailList" },
    ],
  },
  {
    label: "Utilisateur",
    items: [
      { label: "Créer utilisateur", icon: "ti-user-plus", path: "/bo/user/create" },
      { label: "Liste utilisateurs", icon: "ti-users", path: "/bo/user" },
    ],
  },
  {
    label: "Dropdowns",
    items: [
      { label: "States", icon: "", path: "/dropdown/state" },
      { label: "Locations", icon: "", path: "/dropdown/location" },
      { label: "Manufacturers", icon: "", path: "/dropdown/manufacturer" },
    ],
  },
  {
    label: "Imports",
    items: [
      { label: "Import General", icon: "ti-file-import", path: "/bo/import" },
      { label: "Import Alea", icon: "ti-file-import", path: "/import/alea1/" },
      { label: "Import1", icon: "ti-file-import", path: "/bo/import1" },
      { label: "Import2", icon: "ti-file-import", path: "/bo/import2" },
    ],
  },
];

const filteredNavGroups = computed(() => {
  if (!route.path.startsWith('/fo')) {
    return navGroups;
  }
  return navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.path.startsWith('/fo'))
    }))
    .filter(group => group.items.length > 0);
});

const isDarkTheme = computed(() => route.path.startsWith('/fo'));
const brandName = computed(() => isDarkTheme.value ? 'GLPI utilisateur' : 'GLPI Admin');
const userName = computed(() => isDarkTheme.value ? 'User' : 'Administrateur');

function navigate(path) { router.push(path); }
function logout()       { router.push("/import1"); }
</script>

<template>
  <div :class="['app-shell', { 'theme-dark': isDarkTheme }]">
  <div v-if="message" :class="error ? 'err' : 'msg'">
    {{ message }}
  </div>

    <aside v-if="isAuthenticated" class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <i class="ti ti-server" aria-hidden="true"></i>
        </div>
        <div>
          <div class="brand-name">{{ brandName }}</div>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="Navigation principale">
        <template v-for="group in filteredNavGroups" :key="group.label">
          <div class="nav-label">{{ group.label }}</div>
          <a
            v-for="item in group.items"
            :key="item.path"
            class="nav-item"
            :class="{ active: route.path === item.path }"
            :aria-current="route.path === item.path ? 'page' : undefined"
            role="button"
            @click="navigate(item.path)"
          >
            <i :class="`ti ${item.icon}`" aria-hidden="true"></i>
            {{ item.label }}
          </a>
        </template>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="avatar">AD</div>
          <div class="user-info">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">GLPI v2.3.0</div>
          </div>
        </div>
        <button class="logout-btn" title="Se déconnecter" @click="logout">
          <i class="ti ti-logout" aria-hidden="true"></i>
        </button>
      </div>
    </aside>

    <main :class="isAuthenticated ? 'main-content' : 'main-content--full'">
      <router-view />
    </main>
  </div>
</template>

<style>
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sidebar-w:   220px;
  --bg-sidebar:  #0a0a0a;
  --bg-page:     #f7f7f5;
  --bg-card:     #ffffff;
  --text-main:   #0a0a0a;
  --text-muted:  #555555;
  --text-hint:   #999999;
  --border:      #e5e5e5;
  --border-dark: #1e1e1e;
  --active-bg:   #ffffff;
  --active-text: #0a0a0a;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--bg-page);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

.app-shell { display: flex; min-height: 100vh; }

/* ── Sidebar ─────────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  min-width: var(--sidebar-w);
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 900;
}

.sidebar-brand {
  padding: 20px 16px 16px;
  border-bottom: 0.5px solid var(--border-dark);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-icon {
  width: 28px; height: 28px;
  border-radius: 2px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.brand-icon i { color: #ffffff; font-size: 14px; }

.brand-name {
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.brand-sub { display: none; }

.sidebar-nav {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
}
.sidebar-nav::-webkit-scrollbar { display: none; }

.nav-label {
  font-size: 9px;
  font-weight: 600;
  color: #444;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  padding: 16px 16px 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  margin: 0 8px;
  border-radius: 2px;
  color: #666;
  font-size: 12.5px;
  font-weight: 400;
  cursor: pointer;
  transition: color 0.1s, background 0.1s;
  text-decoration: none;
  position: relative;
  user-select: none;
  letter-spacing: 0.1px;
}

.nav-item:hover {
  color: #ccc;
  background: #111;
}

.nav-item.active {
  background: #fff;
  color: #0a0a0a;
  font-weight: 500;
}

.nav-item.active::before { display: none; }

.nav-item i { font-size: 15px; flex-shrink: 0; opacity: 0.7; }
.nav-item.active i { opacity: 1; }

/* ── Footer ──────────────────────────────── */
.sidebar-footer {
  padding: 10px 8px;
  border-top: 0.5px solid var(--border-dark);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.user-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.1s;
  min-width: 0;
}
.user-card:hover { background: #111; }

.avatar {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #1e1e1e;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: #888;
  flex-shrink: 0;
}

.user-name { font-size: 12px; font-weight: 500; color: #ccc; }
.user-role { font-size: 10px; color: #555; margin-top: 1px; }

.logout-btn {
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  padding: 6px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  transition: color 0.1s, background 0.1s;
}
.logout-btn:hover { color: #fff; background: #1e1e1e; }
.logout-btn i { font-size: 15px; }

/* ── Main ────────────────────────────────── */
.main-content       { margin-left: var(--sidebar-w); flex: 1; min-height: 100vh; }
.main-content--full { flex: 1; min-height: 100vh; }

/* ── Toast ───────────────────────────────── */
.msg, .err {
  position: fixed;
  top: 16px; right: 16px;
  z-index: 9999;
  padding: 10px 16px;
  border-radius: 2px;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.2px;
  animation: fadeIn 0.15s ease;
}
.msg { background: #0a0a0a; color: #fff; border: 0.5px solid #222; }
.err { background: #fff; color: #0a0a0a; border: 1px solid #0a0a0a; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Dark theme (/fo) ────────────────────── */
.theme-dark {
  --bg-page: #0f0f0f;
}

.theme-dark .sidebar {
  background: #050505;
  border-right: 0.5px solid #111;
}

.theme-dark .sidebar-brand { border-color: #111; }
.theme-dark .brand-icon { border-color: #222; }

.theme-dark .nav-item { color: #555; }
.theme-dark .nav-item:hover { background: #0d0d0d; color: #999; }
.theme-dark .nav-item.active { background: #1a1a1a; color: #fff; }

.theme-dark .sidebar-footer { border-color: #111; }
.theme-dark .user-card:hover { background: #0d0d0d; }
.theme-dark .logout-btn:hover { background: #111; color: #fff; }

.theme-dark .main-content { background: #0f0f0f; }
</style>