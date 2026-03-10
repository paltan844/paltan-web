/* ========= ACCESS TOKEN ========= */
export const getAccessToken = () =>
  localStorage.getItem("accessToken");

export const setAccessToken = (token: string) =>
  localStorage.setItem("accessToken", token);

export const removeAccessToken = () =>
  localStorage.removeItem("accessToken");

/* ========= REFRESH TOKEN ========= */
export const getRefreshToken = () =>
  localStorage.getItem("refreshToken");

export const setRefreshToken = (token: string) =>
  localStorage.setItem("refreshToken", token);

export const removeRefreshToken = () =>
  localStorage.removeItem("refreshToken");

/* ========= USER ========= */
export const setUserStorage = (user: any) =>
  localStorage.setItem("user", JSON.stringify(user));

export const getUserStorage = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};

/* ========= CLEAR SESSION ========= */
export const clearAuthStorage = () => {
  removeAccessToken();
  removeRefreshToken();
  localStorage.removeItem("user");
};
