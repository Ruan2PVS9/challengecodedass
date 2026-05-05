<template>
  <section class="panel">
    <div class="panel-head">
      <div>
        <p class="panel-kicker">Cadastro</p>
        <h2>Lista de Funcionários</h2>
      </div>

      <router-link to="/employees/new" class="primary-link">Novo cadastro</router-link>
    </div>

    <div class="filters-grid">
      <label>
        <span>CPF</span>
        <input v-model="filters.cpf" placeholder="000.000.000-00" />
      </label>
      <label>
        <span>Nome</span>
        <input v-model="filters.name" placeholder="Buscar por nome" />
      </label>
      <label>
        <span>Email</span>
        <input v-model="filters.email" placeholder="Buscar por email" />
      </label>
      <label>
        <span>Tamanho de camiseta</span>
        <select v-model="filters.tshirt">
          <option value="">Todos</option>
          <option v-for="s in tshirtSizes" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>
      <label>
        <span>Tamanho de calçado</span>
        <input v-model.number="filters.shoe_size" placeholder="34 a 48" type="number" />
      </label>
      <button class="search-button" @click="search">Pesquisar</button>
    </div>

    <div v-if="employees.length === 0" class="empty-state">
      Nenhum funcionário encontrado.
    </div>

    <div v-else class="table-wrap">
      <table class="employees-table">
        <thead>
          <tr>
            <th>CPF</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Camiseta</th>
            <th>Calçado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in employees" :key="emp.id">
            <td>{{ formatCPF(emp.cpf) }}</td>
            <td>{{ emp.name }}</td>
            <td>{{ emp.email }}</td>
            <td><span class="size-pill">{{ emp.tshirt }}</span></td>
            <td><span class="size-pill size-pill-dark">{{ emp.shoe_size }}</span></td>
            <td>
              <div class="actions-inline">
                <router-link :to="`/employees/${emp.id}/edit`" class="secondary-link">Editar</router-link>
                <button class="danger-button" @click="remove(emp.id)">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import api from '../api'
import { formatCPF } from '../utils/formatting'

export default {
  inject: ['toast'],
  data() {
    return {
      employees: [],
      filters: { cpf: '', name: '', email: '', tshirt: '', shoe_size: '' },
      tshirtSizes: ['PP', 'P', 'M', 'G', 'GG', 'XG']
    }
  },
  methods: {
    formatCPF,
    async fetchAll(params = {}) {
      try {
        const res = await api.get('/employees', { params })
        this.employees = res.data
      } catch (err) {
        this.toast().error('Erro ao carregar funcionários')
      }
    },
    search() {
      const params = {}
      Object.keys(this.filters).forEach(k => {
        if (this.filters[k] !== '' && this.filters[k] !== null) params[k] = this.filters[k]
      })
      this.fetchAll(params)
    },
    async remove(id) {
      if (!confirm('Tem certeza que deseja excluir este funcionário?')) return
      try {
        await api.delete(`/employees/${id}`)
        this.toast().success('Funcionário excluído com sucesso!')
        this.fetchAll()
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message
        this.toast().error(errorMsg || 'Erro ao excluir funcionário')
      }
    }
  },
  mounted() {
    this.fetchAll()
  }
}
</script>
