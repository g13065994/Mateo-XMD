const state = require("../../lib/state");

module.exports = {
  name: "uptime",
  aliases: ["up"],
  category: "general",
  description: "Show how long the bot has been running.",
  async execute({ sock, message }) {
    const uptimeMs = Date.now() - state.getState().startedAt;
    const seconds = Math.floor(uptimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const text = `*Uptime:* ${hours}h ${minutes % 60}m ${seconds % 60}s`;
    await sock.sendMessage(message.key.remoteJid, { text }, { quoted: message });
  },
};
