module.exports = {
  name: "kick",
  aliases: ["remove"],
  category: "group",
  description: "Remove a tagged member from the group.",
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
        await sock.sendMessage(jid, { text: "Reply to the user you want to remove." }, { quoted: message });
        return;
      }

      await sock.groupParticipantsUpdate(jid, [target], "remove");
      await sock.sendMessage(jid, { text: "User removed from group." }, { quoted: message });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, { text: `Kick failed: ${error.message || "unknown error"}` }, { quoted: message });
    }
  },
};
