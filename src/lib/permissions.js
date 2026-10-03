const config = require("../config");

function normalizeNum(value) {
  return String(value || "").replace(/\D/g, "");
}

function isOwnerJid(jid) {
  const user = normalizeNum(jid?.split("@")[0] || jid);
  return config.ownerNumbers.some((entry) => normalizeNum(entry) === user);
}

function isAdminJid(jid, admins = []) {
  const user = normalizeNum(jid?.split("@")[0] || jid);
  return admins.some((entry) => normalizeNum(entry) === user);
}

function getPermissionLevel({ jid, admins = [] }) {
  if (isOwnerJid(jid)) return "owner";
  if (isAdminJid(jid, admins)) return "admin";
  return "member";
}

function canRunCommand({ jid, required = "member", admins = [] }) {
  const level = getPermissionLevel({ jid, admins });
  const order = { member: 1, admin: 2, owner: 3 };
  return (order[level] || 0) >= (order[required] || 0);
}

module.exports = {
  normalizeNum,
  isOwnerJid,
  isAdminJid,
  getPermissionLevel,
  canRunCommand,
};
