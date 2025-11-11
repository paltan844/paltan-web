// ✅ productService.ts — Web App Compatible (No React Native imports)
import { appAxios } from "./apilnterceptors";
import { BASE_URL } from "./config";

/* --------------------------- Interfaces --------------------------- */
export interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
  phonenumber?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface BannerItem {
  id: string;
  title: string;
  icon?: string;
}

export interface AppVersionResponse {
  latestVersion: string;
  minSupportedVersion: string;
  forceUpdate: boolean;
  storeUrl: string;
}

export interface Offer {
  _id: string;
  couponCode: string;
  title: string;
  description?: string;
  discountType: "flat" | "percent" | "free_delivery" | "bogo" | "bank";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface LocationData {
  _id: string;
  name: string;
  districts: {
    name: string;
    pincodes: string[];
  }[];
}

/* --------------------------- API Calls --------------------------- */

// 🎯 Get Active Offers
export const getActiveOffers = async (): Promise<Offer[] | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/offers`);
    return data?.success ? data.data : [];
  } catch (error) {
    console.error("❌ Error fetching offers:", error);
    return null;
  }
};

// 🎯 Get Latest App Version (Web platform)
export const getLatestAppVersion = async (): Promise<AppVersionResponse | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/app-version`, {
      params: { platform: "web" },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching app version:", error);
    return null;
  }
};

// 🎯 Get Banners
export const getBanners = async (): Promise<BannerItem[] | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/banners`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    return null;
  }
};

// 🎯 Get Locations
export const getLocationData = async (): Promise<LocationData[] | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/locations`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    return null;
  }
};

// 🎯 Get App Download Link
export const getAppLink = async (): Promise<string | null> => {
  try {
    const { data } = await appAxios.get<{ appLink: string }>(`${BASE_URL}/app-link`);
    return data.appLink;
  } catch (error) {
    console.error("❌ Error fetching app link:", error);
    return null;
  }
};

// 🎯 Chat APIs
export const sendMessageToBackend = async (message: Message) => {
  try {
    const { data } = await appAxios.post(`${BASE_URL}/chat`, message);
    return data;
  } catch (error) {
    console.error("❌ Chat API Error:", error);
    return { text: "Server not reachable. Please try again." };
  }
};

export const getMessagesByPhoneNumber = async (phonenumber: string): Promise<Message[]> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/chat`, {
      params: { phonenumber },
    });
    return data.messages || [];
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return [];
  }
};

// 🎯 Product APIs
export const getProductByCategoryIdByMainId = async (id: string) => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/main/products/${id}`);
    return data;
  } catch (error) {
    console.warn("❌ Error fetching products:", error);
    return [];
  }
};

export const getProductDetailById = async (id: string) => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/productsdetail/${id}`);
    return data;
  } catch (error) {
    console.warn("❌ Error fetching product detail:", error);
    return null;
  }
};

export const getAllCategoriesByMainCategoryId = async (id: string) => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/categories/${id}`);
    return data;
  } catch (error) {
    console.warn("❌ Error fetching categories:", error);
    return [];
  }
};

export const getAllProducts = async (
  page = 1,
  pageSize = 8,
  search = ""
): Promise<any[]> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/products`, {
      params: { page, pageSize, search },
    });
    return data.products || [];
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

// 🎯 Main Categories
export const getMainCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/maincategories`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching main categories:", error);
    return [];
  }
};

// 🎯 Legal & About APIs
export const getLegalInformation = async (): Promise<string> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/legal-info`);
    return data.content;
  } catch (error) {
    console.error("❌ Error fetching legal info:", error);
    return "";
  }
};

export const getAboutPaltan = async (): Promise<string> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/about-paltan`);
    return data.content;
  } catch (error) {
    console.error("❌ Error fetching about info:", error);
    return "";
  }
};
