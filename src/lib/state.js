const state = {
  status: "idle",
  connected: false,
  authenticated: false,
  reconnecting: false,
  reconnectAttempts: 0,
  startedAt: Date.now(),
  lastConnectionAt: null,
  lastDisconnectAt: null,
  lastMessageAt: null,
  lastError: null,
  safetyStatus: "normal",
  mode: "stable",
};

function getState() {
  return { ...state };
}

function updateState(partial = {}) {
  Object.assign(state, partial);
  return state;
}

function setStatus(status) {
  state.status = status;
  return state;
}

function markConnected() {
  state.connected = true;
  state.authenticated = true;
  state.status = "connected";
  state.lastConnectionAt = Date.now();
  state.lastError = null;
  state.safetyStatus = "normal";
  return state;
}

function markDisconnected(error = null) {
  state.connected = false;
  state.authenticated = false;
  state.status = "disconnected";
  state.lastDisconnectAt = Date.now();
  state.lastError = error ? String(error) : null;
  if (error) state.safetyStatus = "warning";
  return state;
}

function markMessage() {
  state.lastMessageAt = Date.now();
  if (state.connected) state.status = "active";
  return state;
}

module.exports = {
  ...state,
  getState,
  updateState,
  setStatus,
  markConnected,
  markDisconnected,
  markMessage,
};
