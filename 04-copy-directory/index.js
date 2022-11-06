const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'files');
const folderNew = path.join(__dirname, 'files-copy');

fs.mkdir(folderNew, { recursive: true }, err => {
    if(err) throw err;
});

fs.readdir(folder, (err, files) => {
    if(err) throw err;

    fs.readdir(folderNew, { withFileTypes: true }, (err, filesNewFolder) => {
        if(err) throw err;
        filesNewFolder.forEach(elem => {
            if(!files.includes(elem.name)) {
                fs.unlink(`${folderNew}/${elem.name}`, err => {
                    return
                });
            };
        });
    });

    files.forEach(file => {
        fs.copyFile(`${folder}/${file}`, `${folderNew}/${file}`, err => {
            if(err) throw err;
        });
    });
});