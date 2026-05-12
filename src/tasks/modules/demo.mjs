/*
импортируйте math.mjs через import и выведите результат add(2, 3).
*/

import { add } from './math.mjs';

console.log(add(2, 3)); // Вывод: 5

/*
Можно ли в .mjs файле использовать require? (спойлер: нет — объясните почему).
Что такое "type": "module" в package.json и как он влияет на расширения файлов?
*/

// В .mjs файлах нельзя использовать require, потому что .mjs файлы предназначены для использования с синтаксисом ES Modules, который использует import/export вместо require/module.exports.

// "type": "module" в package.json указывает Node.js, что все файлы с расширением .js в этом проекте должны обрабатываться как ES Modules. Это означает, что внутри этих файлов можно использовать синтаксис import/export, а не require/module.exports. 
// Если "type": "module" не указан, то по умолчанию файлы с расширением .js обрабатываются как CommonJS модули, и для них используется синтаксис require/module.exports.
