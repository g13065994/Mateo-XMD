const fs = require("fs");
const path = require("path");
const { register, list } = require("./plugin-registry");
const { log, warn } = require("./logger");

function collectFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(resolved, out);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      out.push(resolved);
    }
  }

  return out;
}

function loadPlugins(root = path.resolve(__dirname, "../commands")) {
  const loaded = [];

  if (!fs.existsSync(root)) {
    warn(`Plugin root not found: ${root}`);
    return loaded;
  }

  for (const file of collectFiles(root)) {
    try {
      const mod = require(file);
      const pluginList = Array.isArray(mod) ? mod : [mod];

      for (const plugin of pluginList) {
        if (!plugin || typeof plugin !== "object") continue;

        const pluginObj = plugin.default || plugin;
        if (!pluginObj || !pluginObj.name || typeof pluginObj.execute !== "function") continue;

        register(pluginObj);
        loaded.push(pluginObj);
        log(`Loaded plugin: ${pluginObj.name}`);
      }
    } catch (error) {
      warn(`Failed to load plugin from ${file}: ${error.message}`);
    }
  }

  return loaded;
}

module.exports = {
  loadPlugins,
  listPlugins: () => list(),
};
