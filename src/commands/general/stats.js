const db = require("../../lib/database");
const state = require("../../lib/state");

module.exports = {
  name: "stats",
  aliases: ["stat"],
  category: "general",
  description: "Show bot runtime statistics and database health.",
  async execute({ sock, message }) {
    const snapshot = state.getState();
    const health = await db.healthCheck().catch(() => ({ ok: false, error: "unknown" }));
    const text = [
      "*Mateo-XMD Stats*",
      `Status: ${snapshot.status}`,
      `Connected: ${snapshot.connected ? "yes" : "no"}`,
      `Authenticated: ${snapshot.authenticated ? "yes" : "no"}`,
      `Reconnect attempts: ${snapshot.reconnectAttempts}`,
      `Database ok: ${health.ok ? "yes" : "no"}`,
      `Last message: ${snapshot.lastMessageAt ? new Date(snapshot.lastMessageAt).toISOString() : "never"}`,
    ].join("\n");

    await sock.sendMessage(message.key.remoteJid, { text }, { quoted: message });
  },
};
