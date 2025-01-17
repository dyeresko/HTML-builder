const readline = require('readline');
const fs = require('fs');
const path = require('path');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.setPrompt('Enter the content of a file ');
rl.prompt();
rl.on('line', (data) => {
  if (data === 'exit') {
    rl.write('Goodbye!\n');
    rl.close();
    return;
  }
  if (data !== 'Goodbye!') {
    fs.writeFile(path.join(__dirname, 'file.txt'), data, (err) => {
      if (err) throw err;
    });
  }
});

rl.on('SIGINT', () => {
  rl.write('Goodbye!\n');
  rl.close();
});
