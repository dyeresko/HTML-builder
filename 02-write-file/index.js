const readline = require('readline');
const fs = require('fs');
const path = require('path');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const output = fs.createWriteStream(path.join(__dirname, 'file.txt'));
rl.setPrompt('Enter the content of a file ');
rl.prompt();
rl.on('line', (data) => {
  if (data === 'exit') {
    rl.write('Goodbye!\n');
    rl.close();
  }
  if (data !== 'Goodbye!' && data !== 'exit') {
    output.write(data);
  }
});

rl.on('SIGINT', () => {
  rl.write('Goodbye!\n');
  rl.close();
});
