/*
import { View, StyleSheet } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CustomHeader from "@components/ui/CustomHeader";
import Sidebar from "./Sidebar";
import {
  getAllCategoriesByMainCategoryId,
  getProductByCategoryIdByMainId,
} from "@service/productService";
import ProductList from "./ProductList";
import WithCart from "@features/cart/WithCart";
import ProductListSkeleton from "./ProductListSkeleton";
import EmptyProductListFooter from "./EmptyProductListFooter";
import SidebarSkeleton from "./SidebarSkeleton";
import NoConnectionScreen from "@components/common/NetworkHandler";
import { withNetworkHandlerWithHeader } from "@components/common/withNetworkHandler";
import ProductLoader from "./ProductLoader";

interface Props {
  isConnected?: boolean;
  onRetry?: () => void;
}

const ProductCategories: FC<Props> = ({ isConnected, onRetry }) => {
  const { id: categoryId } = useParams();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [showEmptyFooter, setShowEmptyFooter] = useState<boolean>(false);

  const { state } = useLocation();
  const passedCategory = state?.category;
  const mainCategory = state?.mainCategory;

  useEffect(() => {
    if (mainCategory?.id) fetchCategories();
  }, [passedCategory, mainCategory]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await getAllCategoriesByMainCategoryId(mainCategory?.id);
      setCategories(data || []);

      if (data && data.length > 0) {
        const matched = data.find(
          (cat: any) => cat._id === passedCategory?._id
        );
        setSelectedCategory(matched || data[0]);
      }
    } catch (error) {
      console.warn("❌ Error Fetching Categories", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async (categoryId: string) => {
    try {
      setProductsLoading(true);
      const data = await getProductByCategoryIdByMainId(categoryId);
      setProducts(data || []);
    } catch (error) {
      console.warn("❌ Error Fetching Products", error);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory?._id) {
      fetchProducts(selectedCategory._id);
    }
  }, [selectedCategory]);

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title={selectedCategory?.name || "Categories"} search />

      {!isConnected ? (
        <NoConnectionScreen onRetry={onRetry || fetchCategories} />
      ) : (
        <View style={styles.subContainer}>

          {categoriesLoading ? (
            <View style={styles.sidebarWrapper}>
              <SidebarSkeleton />
            </View>
          ) : (
            <View style={styles.sidebarWrapper}>
              <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryPress={(category: any) => setSelectedCategory(category)}
              />
            </View>
          )}

          {/* ------- PRODUCTS SECTION (FULL WIDTH) ------- /}
          <View style={styles.productsContainer}>
            {productsLoading ? (
              <ProductLoader />
            ) : products.length > 0 ? (
              <ProductList
                data={products}
                categoryId={selectedCategory?._id}
              />
            ) : showEmptyFooter ? (
              <EmptyProductListFooter />
            ) : null}
          </View>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },

  // ⭐ Layout column (sidebar top, product bottom)
  subContainer: {
    flexDirection: "column",
    flex: 1,
  },

  // ⭐ Sidebar full-width
  sidebarWrapper: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 0,
    borderColor: "#eee",
    paddingVertical: 0,
  },

  // ⭐ Products area full-width + full height
  productsContainer: {
    flex: 1,
    width: "100%",
  },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategories));
*/



import { View, StyleSheet } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import CustomHeader from "@components/ui/CustomHeader";
import Sidebar from "./Sidebar";
import {
  getAllCategoriesByMainCategoryId,
  getProductByCategoryIdByMainId,
} from "@service/productService";
import ProductList from "./ProductList";
import WithCart from "@features/cart/WithCart";
import SidebarSkeleton from "./SidebarSkeleton";
import NoConnectionScreen from "@components/common/NetworkHandler";
import { withNetworkHandlerWithHeader } from "@components/common/withNetworkHandler";
import ProductLoader from "./ProductLoader";

interface Props {
  isConnected?: boolean;
  onRetry?: () => void;
}

const CITY = "Prayagraj";

const ProductCategories: FC<Props> = ({ isConnected, onRetry }) => {
  const { state } = useLocation();
  const passedCategory = state?.category;
  const mainCategory = state?.mainCategory;

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  /* ================= FETCH CATEGORIES ================= */

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const data = await getAllCategoriesByMainCategoryId(mainCategory?.id);
      setCategories(data || []);

      if (data?.length) {
        const matched = data.find(
          (cat: any) => cat._id === passedCategory?._id
        );
        setSelectedCategory(matched || data[0]);
      }
    } catch (err) {
      console.warn("❌ Error Fetching Categories", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (mainCategory?.id) fetchCategories();
  }, [mainCategory]);

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async (
    categoryId: string,
    newCursor: string | null = null,
    isLoadMore = false
  ) => {
    try {
      isLoadMore ? setLoadingMore(true) : setProductsLoading(true);

      const res = await getProductByCategoryIdByMainId(
        categoryId,
        newCursor,
        12
      );

      const newProducts = res?.data || [];

      setProducts((prev) =>
        isLoadMore ? [...prev, ...newProducts] : newProducts
      );

      setCursor(res?.nextCursor || null);
      setHasMore(Boolean(res?.nextCursor));
    } catch (error) {
      console.warn("❌ Error Fetching Products", error);
    } finally {
      isLoadMore ? setLoadingMore(false) : setProductsLoading(false);
    }
  };

  /* ================= RESET ON CATEGORY CHANGE ================= */

  useEffect(() => {
    if (!selectedCategory?._id) return;

    // reset everything
    setProducts([]);
    setCursor(null);
    setHasMore(true);

    fetchProducts(selectedCategory._id);
  }, [selectedCategory]);

  const categoryName =
    selectedCategory?.name || passedCategory?.name || "Online Grocery";

  return (
    <>
      <Helmet>
        <title>
          Buy {categoryName} Online in {CITY} | Paltan Shopping Mall
        </title>
      </Helmet>

      <View style={styles.mainContainer}>
        <CustomHeader title={categoryName} search />

        {!isConnected ? (
          <NoConnectionScreen onRetry={onRetry || fetchCategories} />
        ) : (
          <View style={styles.subContainer}>
            {/* SIDEBAR */}
            <View style={styles.sidebarWrapper}>
              {categoriesLoading ? (
                <SidebarSkeleton />
              ) : (
                <Sidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryPress={(cat: any) =>
                    setSelectedCategory(cat)
                  }
                />
              )}
            </View>

            {/* PRODUCTS */}
            <View style={styles.productsContainer}>
              {productsLoading ? (
                <ProductLoader />
              ) : (
                <ProductList
                  data={products}
                  categoryId={selectedCategory?._id}
                  hasMore={hasMore}
                  loadingMore={loadingMore}
                  onEndReached={() => {
                    if (
                      hasMore &&
                      !loadingMore &&
                      selectedCategory?._id
                    ) {
                      fetchProducts(
                        selectedCategory._id,
                        cursor,
                        true
                      );
                    }
                  }}
                />
              )}
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default withNetworkHandlerWithHeader(
  WithCart(ProductCategories)
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flexDirection: "column",
    flex: 1,
  },
  sidebarWrapper: {
    width: "100%",
    backgroundColor: "#f8f8f8",
  },
  productsContainer: {
    flex: 1,
    width: "100%",
  },
});



/*
import { View, StyleSheet } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import CustomHeader from "@components/ui/CustomHeader";
import Sidebar from "./Sidebar";
import {
  getAllCategoriesByMainCategoryId,
  getProductByCategoryIdByMainId,
  getMainCategoryBySlug, // ✅ ONLY ADD
} from "@service/productService";
import ProductList from "./ProductList";
import WithCart from "@features/cart/WithCart";
import EmptyProductListFooter from "./EmptyProductListFooter";
import SidebarSkeleton from "./SidebarSkeleton";
import NoConnectionScreen from "@components/common/NetworkHandler";
import { withNetworkHandlerWithHeader } from "@components/common/withNetworkHandler";
import ProductLoader from "./ProductLoader";

interface Props {
  isConnected?: boolean;
  onRetry?: () => void;
}

const CITY = "Prayagraj";

const ProductCategories: FC<Props> = ({ isConnected, onRetry }) => {
  // ❌ id ❌
  // const { id } = useParams();

  // ✅ slug
  const { slug } = useParams<{ slug: string }>();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showEmptyFooter, setShowEmptyFooter] = useState(false);

  const { state } = useLocation();
  const passedCategory = state?.category;
  const mainCategoryFromState = state?.mainCategory;

  useEffect(() => {
  console.log("🔁 ProductCategories mounted");

  console.log("🌐 URL slug from useParams:", slug);
  console.log("📦 location.state:", state);
  console.log("📦 passedCategory:", passedCategory);
  console.log("📦 mainCategoryFromState:", mainCategoryFromState);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      let mainCategory = mainCategoryFromState;

      // 🔥 SLUG FALLBACK
      if (!mainCategory && slug) {
        console.log("🚀 Fetching mainCategory by slug:", slug);
        mainCategory = await getMainCategoryBySlug(slug);
        console.log("✅ mainCategory API response:", mainCategory);
      }

      if (!mainCategory?._id) {
        console.error("❌ mainCategory NOT RESOLVED — PAGE WILL BE BLANK");
        return;
      }

      console.log("🎯 Using mainCategory._id:", mainCategory._id);

      const data = await getAllCategoriesByMainCategoryId(mainCategory._id);
      console.log("📂 Categories fetched:", data);

      setCategories(data || []);

      if (data && data.length > 0) {
        const matched = data.find(
          (cat: any) => cat._id === passedCategory?._id
        );
        setSelectedCategory(matched || data[0]);
      }
    } catch (error) {
      console.error("🔥 fetchCategories crash:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  fetchCategories();
}, [slug]);

  /* ---------------- FETCH PRODUCTS (UNCHANGED) ---------------- /
  const fetchProducts = async (catId: string) => {
    try {
      setProductsLoading(true);
      const data = await getProductByCategoryIdByMainId(catId);
      setProducts(data || []);
      setShowEmptyFooter(true);
    } catch (error) {
      console.warn("❌ Error Fetching Products", error);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory?._id) {
      fetchProducts(selectedCategory._id);
    }
  }, [selectedCategory]);

  /* ---------------- SEO (UNCHANGED) ---------------- /
  const categoryName =
    selectedCategory?.name || passedCategory?.name || "Online Grocery";

  const mainCategoryName =
    mainCategoryFromState?.name || "Grocery";

  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <Helmet>
        <title>
          Buy {categoryName} Online in {CITY} | {mainCategoryName} | Paltan
        </title>

        <meta
          name="description"
          content={`Order ${categoryName} online in ${CITY} from Paltan Shopping Mall.`}
        />

        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        Buy {categoryName} Online in {CITY}
      </h1>

      <View style={styles.mainContainer}>
        <CustomHeader title={categoryName || "Categories"} search />

        {!isConnected ? (
          <NoConnectionScreen onRetry={onRetry} />
        ) : (
          <View style={styles.subContainer}>
            {categoriesLoading ? (
              <View style={styles.sidebarWrapper}>
                <SidebarSkeleton />
              </View>
            ) : (
              <View style={styles.sidebarWrapper}>
                <Sidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryPress={(cat: any) =>
                    setSelectedCategory(cat)
                  }
                />
              </View>
            )}

            <View style={styles.productsContainer}>
              {productsLoading ? (
                <ProductLoader />
              ) : products.length > 0 ? (
                <ProductList
                  data={products}
                  categoryId={selectedCategory?._id}
                />
              ) : showEmptyFooter ? (
                <EmptyProductListFooter />
              ) : null}
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
  },
  sidebarWrapper: {
    width: "100%",
    backgroundColor: "#f8f8f8",
  },
  productsContainer: {
    flex: 1,
  },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategories));
*/