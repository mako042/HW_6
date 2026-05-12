const fastify = require('fastify')({ logger: true })

fastify.get('/', async (request, reply) => {
    return { server: 'is running' }
})

fastify.get('/health', async (request, reply) => {
    return { status: 'OK' , uptime: process.uptime() }
})

fastify.get('/time', async (request, reply) => {
    return { time: new Date().toISOString() }
})

// Добавьте graceful shutdown: при SIGINT и SIGTERM — закрыть сервер через fastify.close() и вывести Server closed.

process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    await fastify.close();
    console.log('Server closed');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    await fastify.close();
    console.log('Server closed');
    process.exit(0);
});
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