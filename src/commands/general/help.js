const { list } = require("../../lib/plugin-registry");

module.exports = {
  name: "help",
  aliases: ["h", "menu"],
  category: "general",
  description: "Show the available bot commands.",
  async execute({ sock, message }) {
    const commands = list();
    const text = [
      "*Mateo-XMD Help*",
      "",
      ...commands.slice(0, 25).map((cmd) => {
        const aliases = cmd.aliases && cmd.aliases.length ? ` (${cmd.aliases.join(", ")})` : "";
        return `• ${cmd.name}${aliases} — ${cmd.description || "No description provided."}`;
      }),
      "",
      "Use the command prefix configured in this bot.",
    ].join("\n");

    await sock.sendMessage(message.key.remoteJid, { text }, { quoted: message });
  },
};
