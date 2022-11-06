const fs = require('fs');
const path = require('path');

const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
const folderStyles = path.join(__dirname, 'styles');

fs.writeFile(bundleFile, '', err => {
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
                fs.appendFile(bundleFile, fileContent, err => {
                    if(err) throw err;
                });
            }); 
        };
    });
});