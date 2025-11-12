// fix-localstorage.js
// ✅ Run before Expo build to neutralize Node 25's localStorage getter
try {
  if (!Object.getOwnPropertyDescriptor(globalThis, "localStorage")) {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
      },
    });
    console.log("🧩 Pre-build safe localStorage polyfill injected");
  }
} catch (e) {
  console.warn("⚠️ Failed to patch localStorage safely:", e.message);
}
