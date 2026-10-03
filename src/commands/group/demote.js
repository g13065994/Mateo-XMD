module.exports = {
  name: "demote",
  aliases: ["deadmin"],
  category: "group",
  description: "Remove admin privileges from a group member.",
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
        await sock.sendMessage(jid, { text: "Reply to the admin you want to demote." }, { quoted: message });
        return;
      }

      await sock.groupParticipantsUpdate(jid, [target], "demote");
      await sock.sendMessage(jid, { text: "User demoted from admin." }, { quoted: message });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, { text: `Demote failed: ${error.message || "unknown error"}` }, { quoted: message });
    }
  },
};
