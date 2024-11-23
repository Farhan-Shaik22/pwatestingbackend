const fs = require('fs');
const https = require('https');
const httpProxy = require('http-proxy');

// SSL certificate and private key
const sslOptions = {
  key: fs.readFileSync('D:/pwatestingbackend/certificates/localhost-key.pem', 'utf8'),
  cert: fs.readFileSync('D:/pwatestingbackend/certificates/localhost.pem', 'utf8')
};

// Create a proxy server
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000', // Your frontend running on HTTP
  changeOrigin: true // Adjust the origin of the host header to the target
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Something went wrong with the proxy.');
});

// Create an HTTPS server
const httpsServer = https.createServer(sslOptions, (req, res) => {
  console.log(`Proxying request: ${req.url}`);
  proxy.web(req, res);
});

// Start the HTTPS server
const PORT = 443;
httpsServer.listen(PORT, () => {
  console.log(`HTTPS proxy server running on https://localhost:${PORT}`);
});
