const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rootFile = path.join(root, "config.json");
const botFile = path.join(root, "config", "bot.json");

function read(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

const base = read(rootFile);
const bot = read(botFile);
const c = { ...base, ...bot };
const db = c.database || {};
const smart = c.smartBot || {};
const wake = smart.wake || {};
const ai = smart.ai || {};

const config = {
  name: String(c.botName || "XMD WhatsApp Bot"),
  version: "1.0.0",
  prefix: String(c.prefix || "."),
  botNickname: String(c.botNickname || c.botName || "XMD"),
  publicMode: c.publicMode !== false && c.mode !== "private",
  sessionDir: String(c.sessionDir || path.join(root, "data", "sessions")),
  mediaDir: String(c.mediaDir || path.join(root, "data", "media")),
  logLevel: String(c.logLevel || "info"),
  healthPort: Number(c.healthPort || 0),
  ownerNumbers: Array.isArray(c.ownerNumbers) ? c.ownerNumbers : [],
  moderation: {
    maxWarnings: Number(c.moderation?.maxWarnings || 3),
    antiSpamWindowMs: Number(c.moderation?.antiSpamWindowMs || 10000),
    antiSpamLimit: Number(c.moderation?.antiSpamLimit || 5),
    antiLink: Boolean(c.moderation?.antiLink ?? false),
    antiSpam: Boolean(c.moderation?.antiSpam ?? true),
  },
  database: {
    type: String(db.type || "sqlite").toLowerCase(),
    sqlite: db.sqlite || { file: path.join(root, "data", "mateo.sqlite") },
    json: db.json || { file: path.join(root, "data", "database.json") },
    mongodb: db.mongodb || { url: "", dbName: "mateo" },
    healthCheckIntervalMs: Number(db.healthCheckIntervalMs || 0),
    autoMigrate: db.autoMigrate !== false,
  },
  smartBot: smart,
  wake,
  ai,
  pairingCode: c.pairingCode || "",
  pairingNumber: c.pairingNumber || "",
};

function validateConfig() {
  const errors = [];
  if (!config.prefix) errors.push("prefix cannot be empty");
  if (config.pairingCode && !config.pairingNumber) errors.push("pairingNumber is required when pairingCode is enabled");
  return errors;
}

function ensureDirectories() {
  const dbDir = config.database.type === "sqlite"
    ? path.dirname(config.database.sqlite.file)
    : path.dirname(config.database.json.file);

  [config.sessionDir, config.mediaDir, dbDir].forEach((dir) => {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    } catch {
      // no-op: app will fail later if dir cannot be created
    }
  });
}

function loadConfig() {
  const errors = validateConfig();
  if (errors.length) throw new Error(errors.join("; "));
  ensureDirectories();
  return config;
}

module.exports = { ...config, validateConfig, ensureDirectories, loadConfig };
