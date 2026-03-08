// simple dependency‑free proxy using built‑in http module
const http = require('http');
const https = require('https');

function proxyRequest(req, res, targetUrl) {
  const url = new URL(targetUrl);
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = (url.protocol === 'https:' ? https : http).request(options, function (proxyRes) {
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
  const mainUrl = process.env.MAIN_URL || 'http://localhost:3000';
  const fxUrl = process.env.FX_URL || 'http://localhost:3001';
  const boardroomUrl = process.env.BOARDROOM_URL || 'http://localhost:3002';
  const tradermasterUrl = process.env.TRADEMASTER_URL || 'http://localhost:3003';

  if (req.url.startsWith('/home')) {
    req.url = req.url.replace('/home', '') || '/';
    proxyRequest(req, res, mainUrl);
  } else if (req.url.startsWith('/fx-forward-terminal')) {
    req.url = req.url.replace('/fx-forward-terminal', '') || '/';
    proxyRequest(req, res, fxUrl);
  } else if (req.url.startsWith('/multiplayer-boardroom')) {
    req.url = req.url.replace('/multiplayer-boardroom', '') || '/';
    proxyRequest(req, res, boardroomUrl);
  } else if (req.url.startsWith('/ficc-trademaster-pro')) {
    req.url = req.url.replace('/ficc-trademaster-pro', '') || '/';
    proxyRequest(req, res, tradermasterUrl);
  } else {
    // default to main site
    proxyRequest(req, res, mainUrl);
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy listening at http://0.0.0.0:${PORT}`);
});
