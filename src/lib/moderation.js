const db = require("./database");

function normalizeId(id) {
  return String(id || "").trim();
}

function ensureUser(id) {
  const clean = normalizeId(id);
  if (!clean) return null;
  return db.getUser(clean) || db.upsertUser(clean, { warnings: 0, banned: false, role: "member" });
}

function ensureGroup(jid) {
  const clean = normalizeId(jid);
  if (!clean) return null;
  return db.getGroup(clean) || db.upsertGroup(clean, {
    id: clean,
    features: { antiSpam: true, antiLink: false, antiMention: false },
    settings: {},
  });
}

function getGroupFeature(jid, key, fallback = false) {
  const group = ensureGroup(jid);
  if (!group || !group.features) return fallback;
  return group.features[key] ?? fallback;
}

function setGroupFeature(jid, key, value) {
  const group = ensureGroup(jid);
  if (!group) return false;
  group.features = group.features || {};
  group.features[key] = Boolean(value);
  db.upsertGroup(jid, group);
  return true;
}

function warnUser(id, reason = "", limit = 3) {
  const user = ensureUser(id);
  if (!user) return { warnings: 0, banned: false, limit, reason, reachedLimit: false };
  user.warnings = Number(user.warnings || 0) + 1;
  user.reason = reason;
  user.banned = user.warnings >= limit;
  db.upsertUser(id, user);
  return {
    warnings: user.warnings,
    banned: user.banned,
    limit,
    reason,
    reachedLimit: user.warnings >= limit,
  };
}

function banUser(id, reason = "") {
  const user = ensureUser(id);
  if (!user) return { success: false, reason };
  user.banned = true;
  user.reason = reason || "banned by moderation";
  db.upsertUser(id, user);
  return { success: true, reason: user.reason };
}

function unbanUser(id) {
  const user = ensureUser(id);
  if (!user) return false;
  user.banned = false;
  user.reason = "";
  db.upsertUser(id, user);
  return true;
}

function getUserWarnings(id) {
  const user = ensureUser(id);
  return user ? Number(user.warnings || 0) : 0;
}

module.exports = {
  ensureUser,
  ensureGroup,
  getGroupFeature,
  setGroupFeature,
  warnUser,
  banUser,
  unbanUser,
  getUserWarnings,
};
