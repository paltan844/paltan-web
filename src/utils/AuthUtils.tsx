import jwtDecode from 'jwt-decode';
import { Alert } from 'react-native';
import { tokenStorage } from '@state/storage';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { refetchUser, refresh_tokens } from '@service/authService';
import { useAuthStore } from '@state/authStore';

interface DecodedToken {
  exp: number;
}

export const checkAndRefreshToken = async (): Promise<boolean> => {
  const { setUser } = useAuthStore.getState();

  const accessToken = tokenStorage.getString('accessToken') as string;
  const refreshToken = tokenStorage.getString('refreshToken') as string;

  if (accessToken && refreshToken) {
    const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
    const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

    const currentTime = Date.now() / 1000;

    if (decodedRefreshToken?.exp < currentTime) {
      resetAndNavigate('CustomerLogin');
      Alert.alert('Session Expired', 'Please login again');
      return false;
    }

    if (decodedAccessToken?.exp < currentTime) {
      try {
        await refresh_tokens();
        await refetchUser(setUser);
      } catch (error) {
        console.warn(error);
        Alert.alert('Error refreshing session!');
        return false;
      }
    }

    return true;
  }

  resetAndNavigate('CustomerLogin');
  return false;
};
