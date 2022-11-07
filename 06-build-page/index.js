const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

//обратите внимание, что проверка согласно ТЗ должна проверяться на Node текущей LTS версии. Т.к например при версии от 14 и ниже не будет работать такая функция как replaceAll

const folderStyles = path.join(__dirname, 'styles');
const folderProject = path.join(__dirname, 'project-dist');
const folderAssets = path.join(__dirname, 'assets');
const folderAssetsProject = path.join(folderProject, 'assets');
const folderComponents = path.join(__dirname, 'components');
const styleFile = path.join(__dirname, 'project-dist', 'style.css');
const htmlFile = path.join(__dirname, 'project-dist', 'index.html');

const toDo = async () => {
    await createDir();
    await createStyles();
    await copyAssets();
    await createHtml();
};

toDo();

async function createDir() {
    await fsPromises.rm(folderProject, { force: true, recursive: true });
    await fsPromises.mkdir(folderProject, { recursive: true });
};

async function copyAssets() {
    await fsPromises.rm(folderAssetsProject, { force: true, recursive: true });
    await fsPromises.mkdir(folderAssetsProject, { recursive: true });
    await copyDir(folderAssets, folderAssetsProject);
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

async function createStyles() {
    await fsPromises.writeFile(styleFile, '');
    fs.readdir(folderStyles, { withFileTypes: true }, (err, styleFiles) => {
        if(err) throw err;
        styleFiles.forEach(file => {
        if(file.isFile() && path.extname(file.name).slice(1) === 'css') {
            fsPromises.readFile(path.join(folderStyles, file.name), 'utf8').then( (fileContent)=>{
                fsPromises.appendFile(styleFile, fileContent + '\n');
            });
        };
    });
    });
};

async function createHtml() {
    await fsPromises.writeFile(htmlFile, '');

    let htmlContent = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    const tags = htmlContent.match(/{{[^{}]*}}/g) || [];

    for (let i = 0; i < tags.length; i++) {
        let tagName = tags[i].replace('{{', '').replace('}}', '') + '.html';
        let componentPath = path.join(folderComponents, tagName);
        let content = await fsPromises.readFile(componentPath,'utf-8');
        htmlContent = htmlContent.replace(tags[i], content);
    };

    await fsPromises.appendFile(htmlFile, htmlContent, { encoding: 'utf-8' });
};