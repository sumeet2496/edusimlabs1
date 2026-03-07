// simple dependency‑free proxy using built‑in http module
const http = require('http');

function proxyRequest(req, res, port) {
  const options = {
    hostname: 'localhost',
    port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, function (proxyRes) {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(502);
    res.end('Bad gateway');
  });

  req.pipe(proxy, { end: true });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/fx-forward-terminal')) {
    req.url = req.url.replace('/fx-forward-terminal', '') || '/';
    proxyRequest(req, res, 3001);
  } else if (req.url.startsWith('/multiplayer-boardroom')) {
    req.url = req.url.replace('/multiplayer-boardroom', '') || '/';
    proxyRequest(req, res, 3002);
  } else if (req.url.startsWith('/ficc-trademaster-pro')) {
    req.url = req.url.replace('/ficc-trademaster-pro', '') || '/';
    proxyRequest(req, res, 3003);
  } else {
    proxyRequest(req, res, 3000);
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Development proxy listening at http://localhost:${PORT}`);
});
