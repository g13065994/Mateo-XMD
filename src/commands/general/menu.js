const { list } = require("../../lib/plugin-registry");

module.exports = {
  name: "menu",
  aliases: ["mainmenu"],
  category: "general",
  description: "Display the main menu for the bot.",
  async execute({ sock, message }) {
    const commands = list();
    const lines = commands
      .slice(0, 18)
      .map((cmd) => `• ${cmd.name} — ${cmd.description || "Utility command"}`);

    const text = [
      "*Mateo-XMD Menu*",
      "",
      ...lines,
      "",
      "Try: .help, .ping, .uptime, .stats",
    ].join("\n");

    await sock.sendMessage(message.key.remoteJid, { text }, { quoted: message });
  },
};
