const fs = require('fs');

files = fs.readdirSync(process.cwd());

files.forEach(file => {
  if (/\.css/.test(file)) {
    fs.watchFile(`${process.cwd()}/${file}`, () => {
      console.log(`- ${file} changed`);
    })
  }
})