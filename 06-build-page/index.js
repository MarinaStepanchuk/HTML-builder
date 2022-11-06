const fs = require('fs');
const path = require('path');

const folderStyles = path.join(__dirname, 'styles');
const folderProject = path.join(__dirname, 'project-dist');
const folderAssets = path.join(__dirname, 'assets');
const folderAssetsProject = path.join(folderProject, 'assets');
const styleFile = path.join(__dirname, 'project-dist', 'style.css');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
    if(err) throw err;
});

fs.writeFile(styleFile, "", err => {
    if (err) {
        throw err;
    };
});

fs.readdir(folderStyles, { withFileTypes: true }, (err, files) => {
    if(err) throw err;
    files.forEach(file => {
        if(file.isFile() && path.extname(file.name).slice(1) === 'css') {
            fs.readFile(path.join(folderStyles, file.name), 'utf8', function(error, fileContent){
                if(error) throw error;
                fs.appendFile(styleFile, fileContent, err => {
                    if(err) throw err;
                });
            }); 
        };
    });
});

fs.rm(folderAssetsProject, { recursive: true, force: true }, err => {
    if(err) throw err;
    fs.mkdir(folderAssetsProject, { recursive: true }, err => {
        if(err) throw err;
        fs.readdir(folderAssets, { withFileTypes: true }, (err, files) => {
            if(err) throw err;
            files.forEach(file => {
                if(file.isFile()) {
                    fs.copyFile(path.join(folderAssets,file.name), path.join(folderAssetsProject, file.name), err => {
                        if(err) throw err;
                    });
                } else {
                    copyDir(path.join(folderAssets, file.name), path.join(folderAssetsProject, file.name));
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
