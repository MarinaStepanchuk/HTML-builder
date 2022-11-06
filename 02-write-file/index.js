const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');

fs.writeFile(file, '', err => {
    if(err) throw err;
});

stdout.write('Добрый день. Введите текст для записи в файл:\n');

stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        exitFromProcess();
    };
    fs.appendFile(file, data.toString(), err => {
        if(err) throw err;
    });
});

process.on('SIGINT', exitFromProcess);

function exitFromProcess() {
    stdout.write(`Ввод завершен. Введеный текст отразится в файле ${file}`);
    process.exit();
}