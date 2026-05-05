import { createRouter, createWebHistory } from 'vue-router'
import EmployeeList from '../components/EmployeeList.vue'
import EmployeeForm from '../components/EmployeeForm.vue'

const routes = [
  { path: '/', name: 'home', component: EmployeeList },
  { path: '/employees/new', name: 'employee-new', component: EmployeeForm },
  { path: '/employees/:id/edit', name: 'employee-edit', component: EmployeeForm, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
