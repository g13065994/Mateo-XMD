const facts = [
  "A group can have many members, but only a few remain active.",
  "Bot automation works best when the event flow remains stable.",
  "Message commands are faster when the session state is clean.",
  "Health logs help identify silent bot failures before they become serious.",
  "Good automation is as much about pacing as it is about features.",
];

module.exports = {
  name: "fact",
  aliases: ["facts"],
  category: "fun",
  description: "Share a random quick fact.",
  async execute({ sock, message }) {
    const text = `*Quick fact:* ${facts[Math.floor(Math.random() * facts.length)]}`;
    await sock.sendMessage(message.key.remoteJid, { text }, { quoted: message });
  },
};
