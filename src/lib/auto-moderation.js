const { getGroupFeature, warnUser } = require("./moderation");

function inspect({ jid, sender, text = "" }) {
  const groupJid = String(jid || "");
  const raw = String(text || "");

  if (!groupJid || !sender) return { allowed: true, reason: "missing_context" };
  if (!getGroupFeature(groupJid, "antiLink", false)) return { allowed: true, reason: "feature_disabled" };

  if (/(https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me)/i.test(raw)) {
    warnUser(sender, "shared external link", 3);
    return { allowed: false, reason: "external_link_detected", action: "warn" };
  }

  return { allowed: true, reason: "ok" };
}

module.exports = { inspect };
