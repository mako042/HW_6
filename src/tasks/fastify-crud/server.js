const fastify = require('fastify')({ logger: true })

let categories = []
let products = []
let users = []
let nextCategoryId = 1
let nextProductId = 1
let nextUserId = 1

const categoryBodySchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 50 },
    description: { type: 'string', maxLength: 300 }
  }
}

const productBodySchema = {
  type: 'object',
  required: ['name', 'price', 'categoryId'],
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 200 },
    price: { type: 'number', minimum: 0.01 },
    categoryId: { type: 'integer', minimum: 1 },
    inStock: { type: 'boolean' }
  }
}

const userBodySchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['customer', 'admin'] }
  }
}

// GET /api/categories
fastify.get('/api/categories', async (request, reply) => {
  return categories
})

// GET /api/categories/:id
fastify.get('/api/categories/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const category = categories.find(c => c.id === id)
  if (!category) {
    return reply.code(404).send({ error: 'Category not found' })
  }
  return category
})

// POST /api/categories
fastify.post('/api/categories', { schema: { body: categoryBodySchema } }, async (request, reply) => {
  const { name, description } = request.body
  const category = {
    id: nextCategoryId++,
    name,
    description: description || undefined
  }
  categories.push(category)
  return reply.code(201).send(category)
})

// PUT /api/categories/:id
fastify.put('/api/categories/:id', { schema: { body: categoryBodySchema } }, async (request, reply) => {
  const id = Number(request.params.id)
  const category = categories.find(c => c.id === id)
  if (!category) {
    return reply.code(404).send({ error: 'Category not found' })
  }
  const { name, description } = request.body
  category.name = name
  category.description = description || undefined
  return category
})

// DELETE /api/categories/:id
fastify.delete('/api/categories/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const categoryIndex = categories.findIndex(c => c.id === id)
  if (categoryIndex === -1) {
    return reply.code(404).send({ error: 'Category not found' })
  }
  // Check if category has products
  const hasProducts = products.some(p => p.categoryId === id)
  if (hasProducts) {
    return reply.code(400).send({ error: 'Category has products' })
  }
  categories.splice(categoryIndex, 1)
  return { message: 'Category deleted' }
})

// GET /api/products
fastify.get('/api/products', async (request, reply) => {
  let result = products
  const { categoryId, inStock } = request.query

  if (categoryId !== undefined) {
    result = result.filter(p => p.categoryId === Number(categoryId))
  }
  if (inStock !== undefined) {
    result = result.filter(p => p.inStock === (inStock === 'true'))
  }

  return result
})

// GET /api/products/:id
fastify.get('/api/products/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const product = products.find(p => p.id === id)
  if (!product) {
    return reply.code(404).send({ error: 'Product not found' })
  }
  return product
})

// POST /api/products
fastify.post('/api/products', { schema: { body: productBodySchema } }, async (request, reply) => {
  const { name, price, categoryId, inStock } = request.body

  // Check if category exists
  const categoryExists = categories.some(c => c.id === categoryId)
  if (!categoryExists) {
    return reply.code(400).send({ error: 'Category not found' })
  }

  const product = {
    id: nextProductId++,
    name,
    price,
    categoryId,
    inStock: inStock !== undefined ? inStock : true,
    createdAt: new Date().toISOString()
  }
  products.push(product)
  return reply.code(201).send(product)
})

// PUT /api/products/:id
fastify.put('/api/products/:id', { schema: { body: productBodySchema } }, async (request, reply) => {
  const id = Number(request.params.id)
  const product = products.find(p => p.id === id)
  if (!product) {
    return reply.code(404).send({ error: 'Product not found' })
  }

  const { name, price, categoryId, inStock } = request.body

  // Check if category exists
  const categoryExists = categories.some(c => c.id === categoryId)
  if (!categoryExists) {
    return reply.code(400).send({ error: 'Category not found' })
  }

  product.name = name
  product.price = price
  product.categoryId = categoryId
  product.inStock = inStock !== undefined ? inStock : product.inStock

  return product
})

// DELETE /api/products/:id
fastify.delete('/api/products/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const productIndex = products.findIndex(p => p.id === id)
  if (productIndex === -1) {
    return reply.code(404).send({ error: 'Product not found' })
  }
  products.splice(productIndex, 1)
  return { message: 'Product deleted' }
})

// GET /api/users
fastify.get('/api/users', async (request, reply) => {
  let result = users
  const { role } = request.query

  if (role !== undefined) {
    result = result.filter(u => u.role === role)
  }

  return result
})

// GET /api/users/:id
fastify.get('/api/users/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const user = users.find(u => u.id === id)
  if (!user) {
    return reply.code(404).send({ error: 'User not found' })
  }
  return user
})

// POST /api/users
fastify.post('/api/users', { schema: { body: userBodySchema } }, async (request, reply) => {
  const { name, email, role } = request.body

  // Check if email already exists
  const emailExists = users.some(u => u.email === email)
  if (emailExists) {
    return reply.code(409).send({ error: 'Email already exists' })
  }

  const user = {
    id: nextUserId++,
    name,
    email,
    role: role || 'customer',
    createdAt: new Date().toISOString()
  }
  users.push(user)
  return reply.code(201).send(user)
})

// PUT /api/users/:id
fastify.put('/api/users/:id', { schema: { body: userBodySchema } }, async (request, reply) => {
  const id = Number(request.params.id)
  const user = users.find(u => u.id === id)
  if (!user) {
    return reply.code(404).send({ error: 'User not found' })
  }

  const { name, email, role } = request.body

  // Check if email already exists (by another user)
  const emailExists = users.some(u => u.email === email && u.id !== id)
  if (emailExists) {
    return reply.code(409).send({ error: 'Email already exists' })
  }

  user.name = name
  user.email = email
  user.role = role || 'customer'

  return user
})

// DELETE /api/users/:id
fastify.delete('/api/users/:id', async (request, reply) => {
  const id = Number(request.params.id)
  const userIndex = users.findIndex(u => u.id === id)
  if (userIndex === -1) {
    return reply.code(404).send({ error: 'User not found' })
  }
  users.splice(userIndex, 1)
  return { message: 'User deleted' }
})

// ===== Graceful shutdown =====
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Shutting down gracefully...')
  await fastify.close()
  console.log('Server closed')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Shutting down gracefully...')
  await fastify.close()
  console.log('Server closed')
  process.exit(0)
})

// ===== Start server =====
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log('Server is running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()