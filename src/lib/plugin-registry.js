const registry = new Map();
const aliases = new Map();

function normalizeName(name) {
  return String(name || "").trim().toLowerCase();
}

function register(plugin) {
  if (!plugin || !plugin.name || typeof plugin.execute !== "function") {
    throw new Error("Plugin requires name and execute().");
  }

  const name = normalizeName(plugin.name);
  registry.set(name, plugin);

  for (const alias of plugin.aliases || []) {
    const key = normalizeName(alias);
    if (key) aliases.set(key, name);
  }

  return plugin;
}

function get(name) {
  const key = normalizeName(name);
  const targetName = registry.has(key) ? key : aliases.get(key);
  if (!targetName) return null;
  return registry.get(targetName) || null;
}

function list() {
  return [...registry.values()].map((plugin) => ({
    name: plugin.name,
    aliases: plugin.aliases || [],
    category: plugin.category || "general",
    description: plugin.description || "",
  }));
}

function has(name) {
  return !!get(name);
}

function clear() {
  registry.clear();
  aliases.clear();
}

module.exports = { register, get, list, has, clear };
