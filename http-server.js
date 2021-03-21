const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write('hello');

  setTimeout(() => {
    res.end('world');
  }, 5000);
}).listen(3000);