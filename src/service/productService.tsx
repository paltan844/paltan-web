/*
import { appAxios } from "./apilnterceptors";
import { BASE_URL } from "./config";


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
  slug: string;
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
  discountValue?: number;

  minOrderAmount?: number;
  maxDiscount?: number;

  isFirstOrderOnly?: boolean;   // ✅ ADD THIS
  isAutoApply?: boolean;
  isActive?: boolean;

  applicableProducts?: string[];
  applicableCategory?: string[];

  validFrom?: string;
  validTo?: string;
}


export interface LocationData {
  _id: string;
  name: string;
  districts: {
    name: string;
    pincodes: string[];
  }[];
}


export const getActiveOffers = async (): Promise<Offer[] | null> => {
  const { data } = await appAxios.get(`${BASE_URL}/offers`);
  if (data?.success) {
    return data.data;
  }
  return [];
};



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

export const getBanners = async (): Promise<BannerItem[] | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/banners`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    return null;
  }
};

export const getLocationData = async (): Promise<LocationData[] | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/locations`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    return null;
  }
};

export const getAppLink = async (): Promise<string | null> => {
  try {
    const { data } = await appAxios.get<{ appLink: string }>(`${BASE_URL}/app-link`);
    return data.appLink;
  } catch (error) {
    console.error("❌ Error fetching app link:", error);
    return null;
  }
};


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


export const getMainCategories = async (): Promise<Category[]> => {
  try {
    console.log("🌐 API CALL → getMainCategories");

    const { data } = await appAxios.get(`${BASE_URL}/maincategories`);

    console.log("✅ main categories response:", data);

    return data;
  } catch (error) {
    console.error("❌ Error fetching main categories:", error);
    return [];
  }
};


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


export const getMainCategoryBySlug = async (slug: string) => {
  try {
    console.log("🌐 API CALL → getMainCategoryBySlug");
    console.log("➡️ slug passed:", slug);

    const { data } = await appAxios.get(
      `${BASE_URL}/maincategory/slug/${slug}`
    );

    console.log("✅ mainCategory response:", data);

    return data;
  } catch (error) {
    console.error("❌ Error fetching main category by slug:", error);
    return null;
  }
};

// 🔥 GET PRODUCT DETAIL BY SLUG (SEO)
export const getProductDetailBySlug = async (slug: string) => {
  try {
    console.log("🌐 API CALL → getProductDetailBySlug");
    console.log("➡️ slug passed:", slug);

    const { data } = await appAxios.get(
      `${BASE_URL}/productsdetail/slug/${slug}`
    );

    console.log("✅ product by slug response:", data);

    return data;
  } catch (error) {
    console.warn("❌ Error fetching product by slug:", error);
    return null;
  }
};
*/

/*
import { appAxios } from "./apilnterceptors";
import { BASE_URL } from "./config";


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
  discountValue?: number;

  minOrderAmount?: number;
  maxDiscount?: number;

  isFirstOrderOnly?: boolean;   // ✅ ADD THIS
  isAutoApply?: boolean;
  isActive?: boolean;

  applicableProducts?: string[];
  applicableCategory?: string[];

  validFrom?: string;
  validTo?: string;
}


export interface LocationData {
  _id: string;
  name: string;
  districts: {
    name: string;
    pincodes: string[];
  }[];
}


export const getActiveOffers = async (): Promise<Offer[] | null> => {
  const { data } = await appAxios.get(`${BASE_URL}/offers`);
  if (data?.success) {
    return data.data;
  }
  return [];
};



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

export const getBanners = async (): Promise<BannerItem[] | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/banners`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    return null;
  }
};

export const getLocationData = async (): Promise<LocationData[] | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/locations`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    return null;
  }
};

export const getAppLink = async (): Promise<string | null> => {
  try {
    const { data } = await appAxios.get<{ appLink: string }>(`${BASE_URL}/app-link`);
    return data.appLink;
  } catch (error) {
    console.error("❌ Error fetching app link:", error);
    return null;
  }
};


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

export const getMainCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/maincategories`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching main categories:", error);
    return [];
  }
};

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
*/

import { appAxios } from "./apilnterceptors";
import { BASE_URL } from "./config";


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
  slug: string;
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
  discountValue?: number;

  minOrderAmount?: number;
  maxDiscount?: number;

  isFirstOrderOnly?: boolean;  
  isAutoApply?: boolean;
  isActive?: boolean;

  applicableProducts?: string[];
  applicableCategory?: string[];

  validFrom?: string;
  validTo?: string;
}


export interface LocationData {
  _id: string;
  name: string;
  districts: {
    name: string;
    pincodes: string[];
  }[];
}


export const getActiveOffers = async (): Promise<Offer[] | null> => {
  const { data } = await appAxios.get(`${BASE_URL}/offers`);
  if (data?.success) {
    return data.data;
  }
  return [];
};



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

export const getBanners = async (): Promise<BannerItem[] | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/banners`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    return null;
  }
};

export const getLocationData = async (): Promise<LocationData[] | null> => {
  try {
    const { data } = await appAxios.get(`${BASE_URL}/locations`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    return null;
  }
};

export const getAppLink = async (): Promise<string | null> => {
  try {
    const { data } = await appAxios.get<{ appLink: string }>(`${BASE_URL}/app-link`);
    return data.appLink;
  } catch (error) {
    console.error("❌ Error fetching app link:", error);
    return null;
  }
};


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


export const submitBankDetails = async (
  returnId: string,
  payload: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  }
) => {
  try {
    const { data } = await appAxios.post(
      `/return/${returnId}/bank-details`,
      payload
    );

    return data;
  } catch (error: any) {
    console.error("❌ Error submitting bank details:", error);
    throw error;
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


export const getMainCategories = async (): Promise<Category[]> => {
  try {

    const { data } = await appAxios.get(`${BASE_URL}/maincategories`);

    return data;
  } catch (error) {
    console.error("❌ Error fetching main categories:", error);
    return [];
  }
};


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



export const getMainCategoryBySlug = async (slug: string) => {
  try {

    const { data } = await appAxios.get(
      `${BASE_URL}/maincategory/slug/${slug}`
    );
    return data;
  } catch (error) {
    console.error("❌ Error fetching main category by slug:", error);
    return null;
  }
};




export const getProductDetailBySlug = async (slug: string) => {
  try {
    const { data } = await appAxios.get(
      `${BASE_URL}/productsdetail/slug/${slug}`
    );

    return data;
  } catch (error) {
    console.warn("❌ Error fetching product by slug:", error);
    return null;
  }
};



export const createExchangeRequest = async (
  orderId: string,
  items: {
    itemId: string;
    quantity: number;
    reason: string;
  }[]
) => {
  console.log("📦 Sending exchange request to backend", {
    orderId,
    items,
  });

  const { data } = await appAxios.post(
    `/order/${orderId}/return`,
    {
      items,
      type: "EXCHANGE", // future-proof
    }
  );

  return data;
};

