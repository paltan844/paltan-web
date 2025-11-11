// src/utils/checkWebAppUpdate.ts
import axios from 'axios';

export const checkWebAppUpdate = async () => {
  try {
    // Tumhare current web app version ko define karo
    // (ye tum package.json se ya manually env file se le sakte ho)
    const currentVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';

    // Web platform fixed hai
    const platform = 'web';

    // API se latest version info fetch karo
    const { data } = await axios.get(
      `https://your-api-url.com/api/app-version?platform=${platform}`
    );

    const { latestVersion, minSupportedVersion, forceUpdate, siteUrl } = data;

    if (compareVersions(currentVersion, minSupportedVersion) < 0 || forceUpdate) {
      showUpdateDialog({
        title: 'Update Required',
        message: 'Please refresh or update the app to continue.',
        actionText: 'Reload',
        action: () => window.location.reload(),
      });
    } else if (compareVersions(currentVersion, latestVersion) < 0) {
      showUpdateDialog({
        title: 'Update Available',
        message: 'A new version of the web app is available.',
        actionText: 'Reload',
        action: () => window.location.reload(),
      });
    }
  } catch (error) {
    console.error('❌ Web app version check failed:', error);
  }
};

// Version comparison helper
const compareVersions = (v1: string, v2: string): number => {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

// Web dialog helper
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
  if (window.confirm(`${title}\n\n${message}`)) {
    action();
  }
};
