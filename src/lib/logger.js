const util = require("util");
const config = require("../config");

const levels = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
const currentLevel = levels[config.logLevel] ?? 3;

function formatArgs(args) {
  return args.map((arg) => {
    if (typeof arg === "string") return arg;
    return util.inspect(arg, { depth: 4, colors: false });
  }).join(" ");
}

function write(level, ...args) {
  if ((levels[level] ?? 0) > currentLevel) return;
  const ts = new Date().toISOString();
  const message = `[${ts}] [${String(level).toUpperCase()}] ${formatArgs(args)}`;

  if (level === "error") console.error(message);
  else if (level === "warn") console.warn(message);
  else console.log(message);
}

function banner(cfg) {
  write("info", `Starting ${cfg.name || "Mateo-XMD"} v${cfg.version || "1.0.0"}`);
}

module.exports = {
  banner,
  log: (...args) => write("info", ...args),
  error: (...args) => write("error", ...args),
  warn: (...args) => write("warn", ...args),
  debug: (...args) => write("debug", ...args),
};
