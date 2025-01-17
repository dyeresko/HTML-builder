const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);
fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    for (const file of files) {
      if (file.isFile()) {
        const extensionName = path.extname(file.name);
        if (extensionName === '.css') {
          const input = fs.createReadStream(
            path.join(__dirname, 'styles', file.name),
            'utf-8',
          );
          input.on('data', (data) => output.write(data));
          console.log(file.name);
        }
      }
    }
  },
);
