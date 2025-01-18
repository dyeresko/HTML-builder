const fs = require('fs');
const path = require('path');
const filesCopyPath = path.join(__dirname, 'files-copy');
let fileCounter = 0;
fs.access(filesCopyPath, fs.constants.F_OK, (error) => {
  if (error) {
    fs.mkdir(filesCopyPath, (error) => {
      if (error) throw error;
      copyFiles();
    });
  } else {
    fs.readdir(filesCopyPath, (error, files) => {
      if (error) throw error;
      for (const file of files) {
        fs.unlink(path.join(filesCopyPath, file), (error) => {
          if (error) throw error;
          fileCounter += 1;
          if (fileCounter === files.length) {
            copyFiles();
          }
        });
      }
    });
  }
});

const copyFiles = () => {
  fs.readdir(path.join(__dirname, 'files'), (error, files) => {
    if (error) throw error;
    for (const file of files) {
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
        (error) => {
          if (error) throw error;
        },
      );
    }
  });
};
