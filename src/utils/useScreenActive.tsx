import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

let useLocation: any = null;
if (Platform.OS === 'web') {
  try {
    useLocation = require('react-router-dom').useLocation;
  } catch (e) {
    console.warn('⚠️ react-router-dom not found for web navigation');
  }
}

const useScreenActive = (screenName: string) => {
  const [isActive, setIsActive] = useState(false);

  if (Platform.OS === 'web' && useLocation) {
    const location = useLocation();
    useEffect(() => {
      setIsActive(location.pathname === screenName);
    }, [location.pathname, screenName]);
  } else {
    useEffect(() => {
      setIsActive(true);
    }, []);
  }

  return isActive;
};

export default useScreenActive;
