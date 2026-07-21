// Persistent storage boundary for every subsystem.
export const SaveManager = {
  get(key, fallback = null) {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  set(key, value) {
    localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    );
  },
  reset() {
    localStorage.clear();
  },
};
