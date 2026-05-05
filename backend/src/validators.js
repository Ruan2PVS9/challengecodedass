function validateCPF(cpf) {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return false

  if (/^(\d)\1{10}$/.test(cleaned)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i)
  }
  let remainder = sum % 11
  const check1 = remainder < 2 ? 0 : 11 - remainder

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i)
  }
  remainder = sum % 11
  const check2 = remainder < 2 ? 0 : 11 - remainder

  return check1 === parseInt(cleaned[9]) && check2 === parseInt(cleaned[10])
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateTShirtSize(size) {
  const validSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG']
  return validSizes.includes(size)
}

function validateShoeSize(size) {
  const num = parseInt(size)
  return !isNaN(num) && num >= 34 && num <= 48
}

module.exports = {
  validateCPF,
  validateEmail,
  validateTShirtSize,
  validateShoeSize
}
