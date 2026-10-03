module.exports = {
  name: "tagall",
  aliases: ["everyone", "all"],
  category: "group",
  description: "Mention every member in a group.",
  async execute({ sock, message, config }) {
    try {
      const jid = message.key?.remoteJid;
      if (!jid || !jid.endsWith("@g.us")) {
        await sock.sendMessage(jid || message.sender, { text: "This command only works in a group." }, { quoted: message });
        return;
      }

      const metadata = await sock.groupMetadata(jid);
      const mentions = metadata.participants.map((user) => user.id);
      const text = `*Group alert*\n@everyone\n\nMembers: ${mentions.length}`;

      await sock.sendMessage(jid, { text, mentions }, { quoted: message });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, { text: `Tagall failed: ${error.message || "unknown error"}` }, { quoted: message });
    }
  },
};
