'use strict';
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('xmd-baileys');

let sock = null;

async function connectWhatsApp() {
  const authDir = path.join(process.cwd(), 'auth_info');
  fs.mkdirSync(authDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  sock = makeWASocket({
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    auth: state,
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut || statusCode === DisconnectReason.connectionLost) {
        sock = null;
      }
    }

    if (connection === 'open') {
      // ready
    }
  });

  sock.ev.on('creds.update', saveCreds);

  return sock;
}

async function shutdown(reason) {
  try {
    if (sock) {
      await sock.logout?.();
      sock.close?.();
    }
  } catch {
    // ignore shutdown errors
  } finally {
    sock = null;
  }
}

module.exports = { connectWhatsApp, shutdown };
