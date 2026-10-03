const state = require("../../lib/state");

module.exports = {
  name: "status",
  aliases: ["alive", "botstatus"],
  category: "general",
  description: "Show the current bot runtime state.",
  async execute({ sock, message }) {
    const current = state.getState();
    const text = [
      "*Mateo-XMD Status*",
      `Status: ${current.status}`,
      `Connected: ${current.connected ? "yes" : "no"}`,
      `Authenticated: ${current.authenticated ? "yes" : "no"}`,
      `Reconnect attempts: ${current.reconnectAttempts}`,
      `Safety status: ${current.safetyStatus}`,
      `Uptime: ${Math.max(0, Date.now() - current.startedAt)}ms`,
    ].join("\n");

    await sock.sendMessage(message.key.remoteJid, { text }, { quoted: message });
  },
};
