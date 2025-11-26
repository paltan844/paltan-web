
import { Alert } from "react-native";
import { tokenStorage } from "@state/storage";
import { resetAndNavigate } from "@utils/NavigationUtils";
import { refresh_tokens, refetchUser } from "@service/authService";
import { useAuthStore } from "@state/authStore";

export const checkAndRefreshToken = async (): Promise<boolean> => {
  const { setUser } = useAuthStore.getState();

  const accessToken = tokenStorage.getString("accessToken");
  const refreshToken = tokenStorage.getString("refreshToken");

  // No token found → logout
  if (!accessToken || !refreshToken) {
    resetAndNavigate("CustomerLogin");
    return false;
  }

  try {
    // Try silent refresh (backend will decide expiry)
    const newToken = await refresh_tokens();

    if (newToken) {
      await refetchUser(setUser);
      return true;
    }

    // If refreshTokens() returned null → refresh token expired
    resetAndNavigate("CustomerLogin");
    Alert.alert("Session Expired", "Please login again");
    return false;

  } catch (error) {
    console.warn("token check failed:", error);

    // Backend says refresh token expired
    resetAndNavigate("CustomerLogin");
    return false;
  }
};
