const express = require('express')
const cors = require('cors')

const { PrismaClient } = require('@prisma/client')
const { validateCPF, validateEmail, validateTShirtSize, validateShoeSize } = require('./validators')

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))

function validateEmployeeData(data, isUpdate = false) {
  const errors = []

  if (!isUpdate || data.cpf) {
    if (!data.cpf) {
      errors.push('CPF é obrigatório')
    } else if (!validateCPF(data.cpf)) {
      errors.push('CPF inválido')
    }
  }

  if (!isUpdate || data.name) {
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome é obrigatório')
    } else if (data.name.length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres')
    }
  }

  if (!isUpdate || data.email) {
    if (!data.email) {
      errors.push('Email é obrigatório')
    } else if (!validateEmail(data.email)) {
      errors.push('Email inválido')
    }
  }

  if (!isUpdate || data.tshirt) {
    if (!data.tshirt) {
      errors.push('Tamanho de camiseta é obrigatório')
    } else if (!validateTShirtSize(data.tshirt)) {
      errors.push('Tamanho de camiseta inválido')
    }
  }

  if (!isUpdate || data.shoe_size !== undefined) {
    if (data.shoe_size === undefined || data.shoe_size === null) {
      errors.push('Tamanho de calçado é obrigatório')
    } else if (!validateShoeSize(data.shoe_size)) {
      errors.push('Tamanho de calçado deve estar entre 34 e 48')
    }
  }

  return errors
}

app.post('/employees', async (req, res) => {
  try {
    const { cpf, name, email, tshirt, shoe_size } = req.body

    const errors = validateEmployeeData(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') })
    }

    const cleanCPF = cpf.replace(/\D/g, '')

    const existing = await prisma.employee.findUnique({ where: { cpf: cleanCPF } })
    if (existing) {
      return res.status(400).json({ error: 'CPF já cadastrado' })
    }

    const existingEmail = await prisma.employee.findUnique({ where: { email } })
    if (existingEmail) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }

    const employee = await prisma.employee.create({
      data: { cpf: cleanCPF, name, email, tshirt, shoe_size: Number(shoe_size) }
    })
    res.status(201).json(employee)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.get('/employees', async (req, res) => {
  const { cpf, name, email, tshirt, shoe_size } = req.query
  const where = {}
  if (cpf) where.cpf = { contains: cpf.replace(/\D/g, '') }
  if (name) where.name = { contains: name, mode: 'insensitive' }
  if (email) where.email = { contains: email, mode: 'insensitive' }
  if (tshirt) where.tshirt = tshirt
  if (shoe_size) where.shoe_size = Number(shoe_size)

  const employees = await prisma.employee.findMany({ where, orderBy: { name: 'asc' } })
  res.json(employees)
})

app.get('/employees/:id', async (req, res) => {
  const employee = await prisma.employee.findUnique({ where: { id: Number(req.params.id) } })
  if (!employee) return res.status(404).json({ error: 'Funcionário não encontrado' })
  res.json(employee)
})

app.put('/employees/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { cpf, name, email, tshirt, shoe_size } = req.body

    const errors = validateEmployeeData(req.body, true)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') })
    }

    if (cpf) {
      const cleanCPF = cpf.replace(/\D/g, '')
      const existing = await prisma.employee.findUnique({ where: { cpf: cleanCPF } })
      if (existing && existing.id !== id) {
        return res.status(400).json({ error: 'CPF já cadastrado' })
      }
    }

    if (email) {
      const existing = await prisma.employee.findUnique({ where: { email } })
      if (existing && existing.id !== id) {
        return res.status(400).json({ error: 'Email já cadastrado' })
      }
    }

    const updateData = {}
    if (cpf) updateData.cpf = cpf.replace(/\D/g, '')
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (tshirt) updateData.tshirt = tshirt
    if (shoe_size !== undefined) updateData.shoe_size = Number(shoe_size)

    const employee = await prisma.employee.update({ where: { id }, data: updateData })
    res.json(employee)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/employees/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await prisma.employee.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on ${port}`))
