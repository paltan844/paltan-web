/*
import { mmkvStorage } from "@state/storage";

const RECENT_LOCATIONS_KEY = "recentLocations";
const MAX_RECENT = 5;

export type RecentItem = {
  description: string;
  place_id?: string;
};


export const getRecentLocations = (): RecentItem[] => {
  const saved = mmkvStorage.getItem(RECENT_LOCATIONS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const addLocationToRecent = (item: RecentItem) => {
  let recents: RecentItem[] = getRecentLocations();

  recents = recents.filter(
    (x) =>
      x.place_id !== item.place_id &&
      x.description !== item.description
  );

  recents.unshift(item);

  if (recents.length > MAX_RECENT) recents = recents.slice(0, MAX_RECENT);

  mmkvStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(recents));
};

export const clearRecentLocations = () => {
  mmkvStorage.removeItem(RECENT_LOCATIONS_KEY);
};

*/

import { mmkvStorage } from "@state/storage";

const RECENT_LOCATIONS_KEY = "recentLocations";
const MAX_RECENT = 5;

export type RecentItem = {
  description: string;
  place_id?: string;
};


export const getRecentLocations = (): RecentItem[] => {
  const saved = mmkvStorage.getItem(RECENT_LOCATIONS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const addLocationToRecent = (item: RecentItem) => {
  let recents: RecentItem[] = getRecentLocations();

  recents = recents.filter(
    (x) =>
      x.place_id !== item.place_id &&
      x.description !== item.description
  );

  recents.unshift(item);

  if (recents.length > MAX_RECENT) recents = recents.slice(0, MAX_RECENT);

  mmkvStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(recents));
};

export const clearRecentLocations = () => {
  mmkvStorage.removeItem(RECENT_LOCATIONS_KEY);
};
