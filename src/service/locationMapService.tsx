import axios from 'axios';
import { GOOGLE_MAP_API } from './config';
import { updateUserLocation } from './authService';

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
  setUser: any
) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API}`
    );

    if (response.data.status === 'OK') {
      const result = response.data.results[0];
      const address = result.formatted_address;
      const components = result.address_components;

      const pincode = components.find((c: any) =>
        c.types.includes('postal_code')
      )?.long_name;

      const city = components.find((c: any) =>
        c.types.includes('locality')
      )?.long_name;

      const state = components.find((c: any) =>
        c.types.includes('administrative_area_level_1')
      )?.long_name;

      updateUserLocation(
        {
          liveLocation: { latitude, longitude },
          address,
          pincode,
          city,
          state,
        },
        setUser
      );

      return { address, pincode, city, state };
    } else {
      console.error('Geo Code Failed', response.data);
      return null;
    }
  } catch (error) {
    console.error('Geo Code Error', error);
    return null;
  }
};
