const fs = require("fs");

const read = fs.createReadStream('./01-read-file/text.txt', 'utf-8');

let text = '';

read.on('data', part => text += part);
read.on('end', () => console.log(text));
read.on('error', error => console.log('Error', 'File not found'));