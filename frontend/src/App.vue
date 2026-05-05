<template>
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Grupo Dass">
        <img class="brand-logo" src="./logo_dass.webp" alt="Grupo Dass" />
        <span class="brand-text">
          <strong>Grupo Dass</strong>
          <small>Gestão de tamanhos e brindes</small>
        </span>
      </a>

      <nav class="topnav">
        <router-link to="/">Funcionários</router-link>
        <router-link to="/employees/new" class="topnav-action">Novo cadastro</router-link>
      </nav>
    </header>
    <main class="page-content">
      <router-view />
    </main>

    <Toast ref="toast" />
  </div>
</template>

<script>
import Toast from './components/Toast.vue'

export default {
  name: 'App',
  components: { Toast },
  provide() {
    return {
      toast: () => this.$refs.toast
    }
  }
}
</script>
