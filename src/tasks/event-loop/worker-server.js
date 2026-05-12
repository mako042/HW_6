// fastify server (port 3000)

const fastify = require('fastify')({ logger: true })
const { Worker } = require('worker_threads');
const path = require('path');

fastify.get('/fast', async (request, reply) => {
    return { message: 'I am fast' }
})

fastify.get('/slow', async (request, reply) => {
    let sum = 0;
    const chunkSize = 100000000; // 100 млн
    const totalIterations = 5000000000; // 5 млрд

    for (let i = 1; i <= totalIterations; i++) {
        sum += i;
        if (i % chunkSize === 0) {
            await new Promise(resolve => setImmediate(resolve)); // Тут мы отдаем управление Event Loop, позволяя ему обрабатывать другие задачи в очереди
            console.log(`Processed ${i} iterations...`);
        }
    }
    return { result: sum }
})

fastify.get('/slow-worker', async () => {
  const result = await new Promise((resolve, reject) => {
    const worker = new Worker(
      path.join(__dirname, 'slow-worker.js'),
      {
        workerData: {
          limit: 5_000_000_000,
        },
      }
    );

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });

  return { result };
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

// Отличие /slow от /slow-worker в том, что при разбиении на чанки мы выполняем операцию в ТЕКУЩЕМ потоке
// А при использовании Worker Threads, мы выполняем тяжёлую операцию в ОТДЕЛЬНОМ потоке, который не блокирует Event Loop основного потока.
// Например, как с fs.readFile, который выполняется в отдельном потоке и не блокирует Event Loop
// То есть, мы НАЧАЛИ выполнять операцию и просто идём дальше, не дожидаясь её завершения, и можем обрабатывать другие запросы

// Плюс использование Worker Threads позволяет полностью изолировать тяжёлую операцию от основного потока
// Дополнительно, код оптимизируется Турбофаном
// В случае с /slow, мы выполняем тяжёлую операцию в основном потоке, что блокирует Event Loop и не позволяет обрабатывать другие запросы, пока операция не завершится.
// Минус в том, что мы не используем преимущества многопоточности и оптимизаций, которые могут быть применены к коду, выполняющемуся в отдельном потоке.

// плюсы и минусы каждого.
// /slow:
// + Проще в реализации, не требует дополнительного кода для управления потоками
// - Блокирует Event Loop, что может привести к плохой отзывчивости сервера при выполнении тяжёлых операций

// /slow-worker:
// + Не блокирует Event Loop, позволяет обрабатывать другие запросы параллельно
// + Код оптимизируется Турбофаном, что может улучшить производительность
// - Сложнее в реализации, требует управления потоками и обменом данными между ними