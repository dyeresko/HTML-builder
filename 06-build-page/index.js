const fs = require('fs');
const path = require('path');
const assetsPath = path.join(__dirname, 'assets');
const distPath = path.join(__dirname, 'project-dist');
const bundleCSS = () => {
  const output = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
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
};

const bundleHTML = () => {
  const templateInput = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    { encoding: 'utf-8' },
  );
  const output = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'index.html'),
    {
      encoding: 'utf-8',
    },
  );
  let componentCounter = 0;
  const regex = /{{(\w+)}}/g;
  templateInput.on('data', (data) => {
    const components = {};
    let component = regex.exec(data);
    while (component !== null) {
      if (!components[component]) {
        components[`{{${component[1]}}}`] = `${component[1]}.html`;
      }
      component = regex.exec(data);
    }
    for (const item of Object.keys(components)) {
      const componentInput = fs.createReadStream(
        path.join(__dirname, 'components', components[item]),
        { encoding: 'utf-8' },
      );
      componentInput.on('data', (chunk) => {
        data = data.replaceAll(item, chunk);
        componentCounter += 1;
        if (componentCounter === Object.keys(components).length) {
          output.write(data);
        }
      });
    }
  });
};

const createProjectDistDirectory = (assetsPath, distPath) => {
  fs.access(distPath, fs.constants.F_OK, (error) => {
    if (error) {
      fs.mkdir(distPath, (error) => {
        if (error) throw error;
        fs.mkdir(path.join(distPath, 'assets'), (error) => {
          if (error) throw error;
          copyFiles(assetsPath, path.join(distPath, 'assets'));
          bundleHTML();
          bundleCSS();
        });
      });
    } else {
      copyFiles(assetsPath, path.join(distPath, 'assets'));
      bundleHTML();
      bundleCSS();
    }
  });
};
const copyFiles = (src, dest) => {
  fs.readdir(path.join(src), { withFileTypes: true }, (error, files) => {
    if (error) throw error;
    for (const file of files) {
      if (file.isFile()) {
        fs.copyFile(
          path.join(src, file.name),
          path.join(dest, file.name),
          (err) => {
            if (err) throw err;
          },
        );
      } else {
        fs.mkdir(path.join(dest, file.name), () => {
          copyFiles(path.join(src, file.name), path.join(dest, file.name));
        });
      }
    }
  });
};
createProjectDistDirectory(assetsPath, distPath);
