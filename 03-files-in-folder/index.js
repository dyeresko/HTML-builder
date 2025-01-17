const { readdir, stat } = require('fs');
const path = require('path');
readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    for (const file of files) {
      if (file.isFile()) {
        const extensionName = path.extname(file.name);
        const basename = path.basename(file.name, extensionName);
        stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
          console.log(
            `${basename} - ${extensionName.slice(1)} - ${stats.size * 0.001}kB`,
          );
        });
      }
    }
  },
);
