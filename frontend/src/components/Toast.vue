<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div v-for="msg in messages" :key="msg.id" :class="['toast', msg.type]">
        <span>{{ msg.text }}</span>
        <button @click="remove(msg.id)" aria-label="Fechar">&times;</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      messages: [],
      counter: 0
    }
  },
  methods: {
    show(text, type = 'info', duration = 4000) {
      const id = this.counter++
      const msg = { id, text, type }
      this.messages.push(msg)

      if (duration > 0) {
        setTimeout(() => this.remove(id), duration)
      }

      return id
    },
    success(text, duration = 4000) {
      return this.show(text, 'success', duration)
    },
    error(text, duration = 5000) {
      return this.show(text, 'error', duration)
    },
    warning(text, duration = 4000) {
      return this.show(text, 'warning', duration)
    },
    remove(id) {
      const index = this.messages.findIndex(m => m.id === id)
      if (index > -1) this.messages.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  margin-bottom: 10px;
  border-radius: 14px;
  font-size: 14px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
  animation: slideIn 0.3s ease-in-out;
  min-width: 280px;
}

.toast button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-left: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
  color: inherit;
}

.toast button:hover {
  opacity: 1;
}

.toast.success {
  background-color: #f2f7f2;
  color: #0f5132;
  border: 1px solid #c6e3d3;
}

.toast.error {
  background-color: #fff1f1;
  color: #842029;
  border: 1px solid #f1c0c0;
}

.toast.warning {
  background-color: #fff7e6;
  color: #7a4a00;
  border: 1px solid #f1ddb0;
}

.toast.info {
  background-color: #f2f4f7;
  color: #1d2433;
  border: 1px solid #d8dde6;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
