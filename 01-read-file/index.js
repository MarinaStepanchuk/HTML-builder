const fs = require('fs');
const path = require('path');

const read = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let text = '';

read.on('data', part => text += part);
read.on('end', () => console.log(text));
read.on('error', error => console.log('Error', 'File not found'));