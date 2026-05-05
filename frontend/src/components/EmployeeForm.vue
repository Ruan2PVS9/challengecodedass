<template>
  <section class="panel form-panel">
    <div class="panel-head">
      <div>
        <p class="panel-kicker">Funcionário</p>
        <h2>{{ isEdit ? 'Editar' : 'Cadastrar' }} cadastro</h2>
      </div>
      <router-link to="/" class="secondary-link">Voltar para lista</router-link>
    </div>

    <form class="employee-form" @submit.prevent="submit">
      <label>
        <span>CPF *</span>
        <input
          v-model="form.cpf"
          @input="form.cpf = formatCPF(form.cpf)"
          placeholder="000.000.000-00"
          required
          maxlength="14"
        />
        <small v-if="form.cpf && !isCPFValid" class="field-hint field-hint-error">CPF inválido</small>
      </label>

      <label>
        <span>Nome *</span>
        <input v-model="form.name" required minlength="3" placeholder="Nome completo" />
      </label>

      <label>
        <span>Email *</span>
        <input v-model="form.email" type="email" required placeholder="nome@empresa.com" />
      </label>

      <label>
        <span>Tamanho de camiseta *</span>
        <select v-model="form.tshirt" required>
          <option value="">Selecione...</option>
          <option v-for="s in tshirtSizes" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>

      <label>
        <span>Tamanho de calçado (34-48) *</span>
        <input v-model.number="form.shoe_size" type="number" required min="34" max="48" />
      </label>

      <div class="form-actions">
        <button type="submit" class="primary-button">Salvar</button>
        <router-link to="/" class="secondary-link secondary-link-button">Cancelar</router-link>
      </div>
    </form>
  </section>
</template>

<script>
import api from '../api'
import { formatCPF, unmaskCPF, validateEmailFormat } from '../utils/formatting'

export default {
  inject: ['toast'],
  props: ['id'],
  data() {
    return {
      form: { cpf: '', name: '', email: '', tshirt: 'M', shoe_size: 40 },
      tshirtSizes: ['PP', 'P', 'M', 'G', 'GG', 'XG']
    }
  },
  computed: {
    isEdit() {
      return !!this.$route.params.id
    },
    isCPFValid() {
      if (!this.form.cpf || this.form.cpf.length < 14) return true
      return unmaskCPF(this.form.cpf).length === 11
    }
  },
  methods: {
    formatCPF,
    async submit() {
      try {
        if (!this.form.cpf || unmaskCPF(this.form.cpf).length !== 11) {
          this.toast().error('CPF deve ter 11 dígitos')
          return
        }

        if (!validateEmailFormat(this.form.email)) {
          this.toast().error('Email inválido')
          return
        }

        if (this.form.name.length < 3) {
          this.toast().error('Nome deve ter pelo menos 3 caracteres')
          return
        }

        const payload = {
          ...this.form,
          cpf: unmaskCPF(this.form.cpf)
        }

        if (this.isEdit) {
          await api.put(`/employees/${this.$route.params.id}`, payload)
          this.toast().success('Funcionário atualizado com sucesso!')
        } else {
          await api.post('/employees', payload)
          this.toast().success('Funcionário cadastrado com sucesso!')
        }

        setTimeout(() => {
          this.$router.push('/')
        }, 1500)
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message
        this.toast().error(errorMsg || 'Erro ao salvar funcionário')
      }
    }
  },
  async mounted() {
    const id = this.$route.params.id
    if (id) {
      try {
        const res = await api.get(`/employees/${id}`)
        this.form = { ...res.data }
        this.form.cpf = formatCPF(this.form.cpf)
      } catch (err) {
        this.toast().error('Erro ao carregar funcionário')
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
      }
    }
  }
}
</script>
