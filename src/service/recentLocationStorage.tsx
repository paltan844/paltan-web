import { mmkvStorage } from '@state/storage';


const RECENT_LOCATIONS_KEY = 'recentLocations';
const MAX_RECENT = 5;

export const getRecentLocations = (): string[] => {
  const saved = mmkvStorage.getItem(RECENT_LOCATIONS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const addLocationToRecent = (location: string) => {
  let recents = getRecentLocations();

  recents = recents.filter(item => item !== location);

  recents.unshift(location);

  if (recents.length > MAX_RECENT) {
    recents = recents.slice(0, MAX_RECENT);
  }

  mmkvStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(recents));
};

export const clearRecentLocations = () => {
  mmkvStorage.removeItem(RECENT_LOCATIONS_KEY);
};
