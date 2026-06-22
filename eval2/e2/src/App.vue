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

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sidebar-w: 220px;
  --blue:       #1d4ed8;
  --blue-bg:    #eff6ff;
  --blue-avatar: #dbeafe;
  --border:     #e8eaed;
  --bg-page:    #f5f6f8;
  --bg-hover:   #f3f4f6;
  --text-main:  #111827;
  --text-muted: #6b7280;
  --text-hint:  #9ca3af;
}

body {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background: var(--bg-page);
  color: var(--text-main);
}

.app-shell { display: flex; min-height: 100vh; }

/* ── Sidebar ─────────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  min-width: var(--sidebar-w);
  background: #ffffff;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 900;
}

.sidebar-brand {
  padding: 18px 16px 14px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
  flex-shrink: 0;
}

.brand-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--blue);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.brand-icon i { color: #fff; font-size: 16px; }

.brand-name { font-size: 14px; font-weight: 600; color: var(--text-main); }
.brand-sub  { font-size: 11px; color: var(--text-hint); margin-top: 1px; }

.sidebar-nav {
  flex: 1; padding: 10px 8px;
  overflow-y: auto;
  display: flex; flex-direction: column; gap: 1px;
}

.nav-label {
  font-size: 10px; font-weight: 600;
  color: var(--text-hint);
  letter-spacing: 0.8px; text-transform: uppercase;
  padding: 14px 8px 5px;
}

.nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 7px 9px; border-radius: 6px;
  color: var(--text-muted); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.12s ease;
  text-decoration: none; position: relative;
  white-space: nowrap; user-select: none;
}

.nav-item:hover { background: var(--bg-hover); color: var(--text-main); }

.nav-item.active {
  background: var(--blue-bg);
  color: var(--blue);
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  width: 3px; height: 18px;
  border-radius: 0 2px 2px 0;
  background: var(--blue);
}

.nav-item i { font-size: 16px; flex-shrink: 0; }

/* ── Footer ──────────────────────────────── */
.sidebar-footer {
  padding: 10px 8px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; gap: 6px;
  flex-shrink: 0;
}

.user-card {
  flex: 1; display: flex; align-items: center; gap: 9px;
  padding: 7px 8px; border-radius: 6px;
  cursor: pointer; transition: background 0.12s;
  min-width: 0;
}
.user-card:hover { background: var(--bg-hover); }

.avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--blue-avatar);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600; color: var(--blue);
  flex-shrink: 0;
}

.user-name { font-size: 12px; font-weight: 600; color: var(--text-main); }
.user-role { font-size: 11px; color: var(--text-hint); }

.logout-btn {
  background: none; border: none;
  color: var(--text-hint);
  cursor: pointer; padding: 6px; border-radius: 6px;
  display: flex; align-items: center;
  transition: all 0.12s;
}
.logout-btn:hover { background: #fee2e2; color: #ef4444; }
.logout-btn i { font-size: 16px; }

/* ── Main ────────────────────────────────── */
.main-content      { margin-left: var(--sidebar-w); flex: 1; min-height: 100vh; }
.main-content--full { flex: 1; min-height: 100vh; }


.theme-dark .sidebar {
  background: #111827;
  border-color: #334155;
}

.theme-dark .sidebar-brand {
  border-color: #334155;
}

.theme-dark .brand-icon {
  background: #2563eb;
}

.theme-dark .brand-name,
.theme-dark .user-name,
.theme-dark .user-role,
.theme-dark .nav-label,
.theme-dark .nav-item,
.theme-dark .sidebar-footer {
  color: #e2e8f0;
}

.theme-dark .brand-sub,
.theme-dark .user-role,
.theme-dark .nav-item {
  color: #cbd5e1;
}

.theme-dark .sidebar-nav {
  background: #111827;
}

.theme-dark .nav-item:hover {
  background: #1e293b;
  color: #f8fafc;
}

.theme-dark .nav-item.active {
  background: #1d4ed8;
  color: #ffffff;
}

.theme-dark .nav-item.active::before {
  background: #60a5fa;
}

.theme-dark .sidebar-footer {
  border-top-color: #334155;
}

.theme-dark .user-card:hover {
  background: #1e293b;
}

.theme-dark .logout-btn {
  color: #cbd5e1;
}

.theme-dark .logout-btn:hover {
  background: #f87171;
  color: #ffffff;
}

.toast {
  position: fixed; top: 16px; right: 16px; z-index: 9999;
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  box-shadow: 0 1px 6px rgba(0,0,0,0.10);
  animation: slideIn 0.18s ease;
}
.toast--success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.toast--error   { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }

@keyframes slideIn {
  from { transform: translateX(16px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
</style>