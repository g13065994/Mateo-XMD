module.exports = {
  name: "owner",
  aliases: ["dev", "creator"],
  category: "tools",
  description: "Display owner information and contact details.",
  async execute({ sock, message }) {
    const text = [
      "*Mateo-XMD Owner*",
      "Owner: Gerald Max",
      "Project: Mateo-XMD",
      "Role: Maintenance and feature upgrades",
    ].join("\n");

    await sock.sendMessage(message.key.remoteJid, { text }, { quoted: message });
  },
};
