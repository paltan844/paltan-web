import axios from "axios";

const getAppVersion = () => {
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env) {
      // @ts-ignore
      return import.meta.env.VITE_APP_VERSION;
    }
  } catch (e) {}

  // ✅ RN Fallback (Expo/React Native)
  return process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0";
};

// ------------------------------
// Compare Versions helper
// ------------------------------
const compareVersions = (v1: string, v2: string): number => {
  const a = v1.split(".").map(Number);
  const b = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

// ------------------------------
// Web-only Dialog
// ------------------------------
const showUpdateDialog = ({
  title,
  message,
  actionText,
  action,
}: {
  title: string;
  message: string;
  actionText: string;
  action: () => void;
}) => {
  if (typeof window !== "undefined" && window.confirm) {
    if (window.confirm(`${title}\n\n${message}`)) {
      action();
    }
  }
};

// ------------------------------
// Main Function: checkWebAppUpdate
// ------------------------------
export const checkWebAppUpdate = async () => {
  try {
    const currentVersion = getAppVersion(); // ⭐ Safe version fetch
    const platform = "web";

    const { data } = await axios.get(
      `https://your-api-url.com/api/app-version?platform=${platform}`
    );

    const { latestVersion, minSupportedVersion, forceUpdate } = data;

    // Force update
    if (
      compareVersions(currentVersion, minSupportedVersion) < 0 ||
      forceUpdate
    ) {
      showUpdateDialog({
        title: "Update Required",
        message: "Please refresh or update the app to continue.",
        actionText: "Reload",
        action: () => window.location.reload(),
      });
      return;
    }

    // Optional update
    if (compareVersions(currentVersion, latestVersion) < 0) {
      showUpdateDialog({
        title: "Update Available",
        message: "A new version of the web app is available.",
        actionText: "Reload",
        action: () => window.location.reload(),
      });
    }
  } catch (error) {
    console.error("❌ Web app version check failed:", error);
  }
};
