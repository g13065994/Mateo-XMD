const { getGroupFeature, warnUser } = require("./moderation");

const buckets = new Map();

function getBucketKey(sender, jid) {
  return `${String(jid || "unknown")}::${String(sender || "unknown")}`;
}

function inspect({ jid, sender, text = "" }) {
  const groupJid = String(jid || "");
  const user = String(sender || "");

  if (!groupJid || !user) return { allowed: true, reason: "missing_context" };
  if (!getGroupFeature(groupJid, "antiSpam", true)) return { allowed: true, reason: "feature_disabled" };

  const payload = String(text || "");
  const now = Date.now();
  const key = getBucketKey(user, groupJid);
  const bucket = buckets.get(key) || [];
  const recent = bucket.filter((ts) => now - ts < 10000);
  recent.push(now);
  buckets.set(key, recent);

  if (recent.length > 5) {
    warnUser(user, "spamming / message flood", 3);
    return { allowed: false, reason: "spam_detected", action: "warn" };
  }

  if (payload.length > 3000) {
    warnUser(user, "oversized message", 3);
    return { allowed: false, reason: "oversized_message", action: "warn" };
  }

  return { allowed: true, reason: "ok" };
}

module.exports = { inspect };
