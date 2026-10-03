const { unbanUser } = require("../../lib/moderation");

module.exports = {
  name: "unban",
  aliases: ["unblock"],
  category: "group",
  description: "Remove a ban from a user.",
  async execute({ sock, message }) {
    const jid = message.key?.remoteJid;
    const target = message.quoted?.sender || message.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) {
      await sock.sendMessage(jid, { text: "Reply to the user you want to unban." }, { quoted: message });
      return;
    }

    const ok = unbanUser(target);
    await sock.sendMessage(jid, { text: ok ? "User unbanned." : "User was not banned." }, { quoted: message });
  },
};
