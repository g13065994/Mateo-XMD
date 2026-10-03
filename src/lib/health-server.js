'use strict';
const http = require('http');

class HealthServer {
  constructor({ status, logger, port = process.env.MATEO_HEALTH_PORT || 0 } = {}) {
    this.status = status;
    this.logger = logger || console;
    this.port = Number(port) || 0;
    this.server = null;
  }

  start() {
    if (this.server) return this;

    this.server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url || '/', 'http://localhost');
        const pathname = url.pathname;
        const payload = this.status?.() || {};

        if (pathname === '/health' || pathname === '/status') {
          const ok = payload?.database?.ok !== false;
          const code = ok ? 200 : 500;
          const body = JSON.stringify(payload, null, 2);
          res.writeHead(code, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          });
          res.end(body);
          return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'not_found' }));
      } catch (err) {
        this.logger?.error?.('HealthServer request error', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'internal_server_error' }));
      }
    });

    this.server.listen(this.port, () => {
      const addr = this.server.address();
      this.port = (addr && addr.port) || this.port;
      this.logger?.log?.(`Health server listening on port ${this.port}`);
    });

    this.server.unref?.();
    return this;
  }

  stop() {
    if (!this.server) return Promise.resolve();
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) return reject(err);
        this.server = null;
        resolve();
      });
    });
  }
}

module.exports = HealthServer;
