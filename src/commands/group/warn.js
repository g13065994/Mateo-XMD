const { getGroupFeature, warnUser } = require("./moderation");

module.exports = {
  name: "warn",
  aliases: ["warning"],
  category: "group",
  description: "Warn a user who violates the group rules.",
  async execute({ sock, message }) {
    const jid = message.key?.remoteJid;
    if (!jid || !jid.endsWith("@g.us")) {
      await sock.sendMessage(jid || message.sender, { text: "This command only works in a group." }, { quoted: message });
      return;
    }

    const target = message.quoted?.sender || message.message?.extendedTextMessage?.contextInfo?.participant;
    if (!target) {
      await sock.sendMessage(jid, { text: "Reply to the user you want to warn." }, { quoted: message });
      return;
    }

    const result = warnUser(target, "manual warning", 3);
    await sock.sendMessage(jid, {
      text: `@${target.split("@")[0]} has ${result.warnings} warning(s).`,
      mentions: [target],
    }, { quoted: message });
  },
};
