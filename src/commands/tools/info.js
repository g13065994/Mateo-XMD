module.exports = {
  name: "info",
  aliases: ["botinfo", "about"],
  category: "tools",
  description: "Show the basic information about the current Mateo-XMD instance.",
  async execute({ sock, message, config }) {
    const text = [
      "*Mateo-XMD Info*",
      `Name: ${config?.name || "Mateo-XMD"}`,
      `Version: ${config?.version || "1.0.0"}`,
      `Prefix: ${config?.prefix || "."}`,
      "Runtime: WhatsApp / XMD Baileys",
      "Status: online and ready",
    ].join("\n");

    await sock.sendMessage(message.key.remoteJid, { text }, { quoted: message });
  },
};
