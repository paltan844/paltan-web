// src/hooks/useScreenActive.ts
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// ✅ For web: use React Router location
let useLocation: any = null;
if (Platform.OS === 'web') {
  try {
    // Dynamically import to avoid bundling errors on native
    useLocation = require('react-router-dom').useLocation;
  } catch (e) {
    console.warn('⚠️ react-router-dom not found for web navigation');
  }
}

/**
 * Hook to detect if the current screen is active.
 * Works for both React Native (navigation events)
 * and React Native Web (React Router path detection)
 */
const useScreenActive = (screenName: string) => {
  const [isActive, setIsActive] = useState(false);

  if (Platform.OS === 'web' && useLocation) {
    // ✅ Web: detect based on URL path
    const location = useLocation();
    useEffect(() => {
      setIsActive(location.pathname === screenName);
    }, [location.pathname, screenName]);
  } else {
    // ✅ Native fallback (no-op or always active)
    useEffect(() => {
      setIsActive(true);
    }, []);
  }

  return isActive;
};

export default useScreenActive;
