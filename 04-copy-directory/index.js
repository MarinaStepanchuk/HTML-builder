const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const folderCopy = path.join(__dirname, 'files');
const folderNewCopy = path.join(__dirname, 'files-copy');

copyFolder()

async function copyFolder() {
    await fsPromises.rm(folderNewCopy, { force: true, recursive: true });
    await fsPromises.mkdir(folderNewCopy, { recursive: true });
    await copyDir(folderCopy, folderNewCopy);
};

async function copyDir(folder, folderNew) {
    const files = await fsPromises.readdir(folder, { withFileTypes: true });
    files.forEach(file => {
        if(file.isFile()) {
            fsPromises.copyFile(path.join(folder,file.name), path.join(folderNew, file.name));
        } else {
            fsPromises.mkdir(path.join(folderNew, file.name), { recursive: true }).then(
            copyDir(path.join(folder, file.name), path.join(folderNew, file.name)));
        };
    });
};