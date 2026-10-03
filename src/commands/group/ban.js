const { banUser } = require("../../lib/moderation");

module.exports = {
  name: "ban",
  aliases: ["block"],
  category: "group",
  description: "Ban a user from the bot or group context.",
  async execute({ sock, message }) {
    const jid = message.key?.remoteJid;
    const target = message.quoted?.sender || message.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) {
      await sock.sendMessage(jid, { text: "Reply to the user you want to ban." }, { quoted: message });
      return;
    }

    const result = banUser(target, "moderation ban");
    await sock.sendMessage(jid, { text: result.success ? "User has been banned." : "Ban failed." }, { quoted: message });
  },
};
