const fs = require('fs');
const path = require('path');

//обратите внимание, что проверка согласно ТЗ должна проверяться на Node текущей LTS версии. Т.к например при версии от 14 и ниже не будет работать такая функция как replaceAll

const folderStyles = path.join(__dirname, 'styles');
const folderProject = path.join(__dirname, 'project-dist');
const folderAssets = path.join(__dirname, 'assets');
const folderAssetsProject = path.join(folderProject, 'assets');
const folderComponents = path.join(__dirname, 'components');
const styleFile = path.join(__dirname, 'project-dist', 'style.css');
const htmlFile = path.join(__dirname, 'project-dist', 'index.html');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
    if(err) throw err;
});

fs.writeFile(styleFile, '', err => {
    if (err) {
        throw err;
    };
});

fs.writeFile(htmlFile, '', err => {
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

let htmlContent = '';
const readStrim = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf8');

readStrim.on('data', part => htmlContent += part)

readStrim.on('end', () => {
        fs.readdir(folderComponents, { withFileTypes: true }, (err, files) => {
            if(err) throw err;
            files.forEach(file => {
                if(file.isFile() && path.extname(file.name) === '.html') {
                    let name = file.name.split('.')[0];
                    let component = '';

                    const readStrimComponents = fs.createReadStream(path.join(folderComponents, file.name), 'utf8');

                    readStrimComponents.on('data', part => component += part )

                    readStrimComponents.on('end', () => {
                        htmlContent = htmlContent.replaceAll(`{{${name}}}`, component)
                        fs.writeFile(htmlFile, htmlContent, err => {
                            if(err) throw err;
                        });
                    });
                };
            });
        });
});