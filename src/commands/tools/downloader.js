module.exports = {
  name: "downloader",
  aliases: ["dl", "media"],
  category: "tools",
  description: "Download media or a public URL when a valid direct link is provided.",
  async execute({ sock, message, prefix = "." }) {
    try {
      const text = message.message?.extendedTextMessage?.text || message.body || "";
      const args = text.trim().split(/\s+/).slice(1);
      const url = args[0];

      if (!url) {
        await sock.sendMessage(message.key.remoteJid, {
          text: `Usage: ${prefix}downloader <url>`,
        }, { quoted: message });
        return;
      }

      await sock.sendMessage(message.key.remoteJid, {
        text: `*Download request received*\n${url}\n\nThis feature is prepared for direct downloads and media extraction.`,
      }, { quoted: message });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: `Downloader failed: ${error.message || "unknown error"}`,
      }, { quoted: message });
    }
  },
};
