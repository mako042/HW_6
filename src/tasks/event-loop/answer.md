Я думаю, что сначала выполнится синхронный код
1
12
Потом nextTick, он имеет приоритет над другими очередями
6
потом promise
4
5
потом таймеры 
2
потом check()
3
потом I/O функция, после чтения которой выполняется callback
7
потом nexttick
11
потом promise
10
потом таймер
8
event loop окончен, выполняем setImmediate
9


C:\Program Files\nodejs\node.exe .\src\tasks\event-loop\task1-order-prediction.js
1: sync start
12: sync end
6: nextTick
4: promise.then 1
5: promise.then 2
2: setTimeout 0
3: setImmediate
7: readFile callback
11: inner nextTick
10: inner promise
9: inner setImmediate
8: inner setTimeout 0

Отличие -- в моём понимании как выполняются операции check
сначала -- таймеры
потом -- check

Так же у меня было неверное понимание порядка выполнения I/O функции
Она НАЧАЛА выполняться после того, как nodejs достиг этой строки
Но мы НЕ ждём пока она выполнится и идём дальше по циклу событий и выводим таймер, пока выполняется мы ещё усспевааем вывести check и когда файл прочитан -- callback попадает в очередь и выполняется при следующем проходе цикла событий (у меня ушло полтора часа чтобы понять эту логику..)