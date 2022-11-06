const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'files');
const folderNew = path.join(__dirname, 'files-copy');

fs.rm(folderNew, { recursive: true, force: true }, err => {
    if(err) throw err;
    fs.mkdir(folderNew, { recursive: true }, err => {
        if(err) throw err;
        fs.readdir(folder, { withFileTypes: true }, (err, files) => {
            if(err) throw err;
            files.forEach(file => {
                if(file.isFile()) {
                    fs.copyFile(path.join(folder,file.name), path.join(folderNew, file.name), err => {
                        if(err) throw err;
                    });
                } else {
                    copyDir(path.join(folder, file.name), path.join(folderNew, file.name));
                };
            });
        });
    });
});

function copyDir(dir, newDir) {
    fs.mkdir(newDir, { recursive: true }, err => {
        if(err) throw err;
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if(err) throw err;
            files.forEach(file => {
                if(file.isFile()) {
                    fs.copyFile(path.join(dir, file.name), path.join(newDir, file.name), err => {
                        if(err) throw err;
                    });
                } else {
                    copyDir(path.join(dir, file.name), path.join(newDir, file.name));
                };
            });
        });
    });
};