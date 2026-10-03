module.exports = {
  name: "promote",
  aliases: ["admin"],
  category: "group",
  description: "Promote a user to group admin.",
  async execute({ sock, message }) {
    try {
      const jid = message.key?.remoteJid;
      if (!jid || !jid.endsWith("@g.us")) {
        await sock.sendMessage(jid || message.sender, { text: "This command only works in a group." }, { quoted: message });
        return;
      }

      const quoted = message.quoted;
      const target = quoted?.sender || message.message?.extendedTextMessage?.contextInfo?.participant;
      if (!target) {
        await sock.sendMessage(jid, { text: "Reply to the user you want to promote." }, { quoted: message });
        return;
      }

      await sock.groupParticipantsUpdate(jid, [target], "promote");
      await sock.sendMessage(jid, { text: "User promoted to admin." }, { quoted: message });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, { text: `Promote failed: ${error.message || "unknown error"}` }, { quoted: message });
    }
  },
};
