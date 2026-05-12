// CPU-bound

function sumUpToOneBillion() {
    let sum = 0;
    for (let i = 1; i <= 1000000000; i++) {
        sum += i;
    }
    return sum;
}

console.time('sumUpToOneBillion');
setTimeout(() => console.log('I should fire in 100ms'), 100);
const result = sumUpToOneBillion();
console.timeEnd('sumUpToOneBillion');
console.log('Result:', result); 

// I/O-bound
const fs = require('fs').promises;

async function readFiles() {
    const fileNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt', 'file6.txt', 'file7.txt', 'file8.txt', 'file9.txt', 'file10.txt'];
    
    console.time('readFiles');
    const readPromises = fileNames.map(fileName => fs.readFile('./src/tasks/event-loop/tmp-files/' + fileName, 'utf-8'));
    const contents = await Promise.all(readPromises);
    console.timeEnd('readFiles');
    
    return contents;
}

readFiles().then(contents => {
    console.log('File contents:', contents);
}).catch(error => {
    console.error('Error reading files:', error);
});

// Почему I/O-bound не блокирует Event Loop, а CPU-bound — блокирует.

// Ответ: I/O-bound операции (например, чтение файлов) выполняются асинхронно и не блокируют Event Loop, так как они обрабатываются в фоновом режиме. 
// Когда операция завершена, результат возвращается через колбек или промис, позволяя другим задачам выполняться параллельно. 
// В то время как CPU-bound операции (например, сложные вычисления) выполняются синхронно и блокируют Event Loop, так как они требуют непрерывного использования процессора, не позволяя другим задачам выполняться до завершения текущей операции.

// Почему setTimeout сработает после завершения CPU-bound операции, даже если время задержки уже прошло?

// Ответ: setTimeout ставит свою колбек-функцию в очередь задач после указанного времени задержки. 
// Однако, если в это время Event Loop занят выполнением CPU-bound операции, колбек не может быть обработан, так как Event Loop не может переключиться на выполнение других задач, пока текущая операция не завершится. 
// Поэтому, даже если время задержки уже прошло, колбек от setTimeout будет выполнен только после завершения CPU-bound операции, когда Event Loop освободится и сможет обработать задачи из очереди.