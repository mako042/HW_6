const { parentPort, workerData } = require('worker_threads');

let sum = 0;

for (let i = 1; i <= workerData.limit; i++) {
  sum += i;
}

parentPort.postMessage(sum);