
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
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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

const CITY = "Prayagraj";

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

  /* ---------------- FETCH CATEGORIES ---------------- */
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

  /* ---------------- FETCH PRODUCTS ---------------- */
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

  /* ---------------- SEO VALUES ---------------- */
  const categoryName =
    selectedCategory?.name || passedCategory?.name || "Online Grocery";

  const mainCategoryName = mainCategory?.name || "Grocery";

  const pageTitle = `Buy ${categoryName} Online in ${CITY} | ${mainCategoryName} | Paltan Shopping Mall`;

  const pageDescription = `Order ${categoryName} online in ${CITY} from Paltan Shopping Mall. Fresh products, best prices and fast delivery.`;

  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href : "";

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* 🔥 SEO BLOCK (NO UI IMPACT) */}
      <Helmet>
        <title>{pageTitle}</title>

        <meta name="description" content={pageDescription} />

        <link rel="canonical" href={canonicalUrl} />

        {/* Category + SubCategory Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${categoryName} in ${CITY}`,
            url: canonicalUrl,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://paltanshoppingmall.in",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: mainCategoryName,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: categoryName,
                },
              ],
            },
            isPartOf: {
              "@type": "WebSite",
              name: "Paltan Shopping Mall",
              url: "https://paltanshoppingmall.in",
            },
          })}
        </script>
      </Helmet>

      {/* 🔒 Invisible H1 (Blinkit-style) */}
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

      {/* ---------------- UI (UNCHANGED) ---------------- */}
      <View style={styles.mainContainer}>
        <CustomHeader title={categoryName || "Categories"} search />

        {!isConnected ? (
          <NoConnectionScreen onRetry={onRetry || fetchCategories} />
        ) : (
          <View style={styles.subContainer}>
            {/* ---------- SIDEBAR ---------- */}
            {categoriesLoading ? (
              <View style={styles.sidebarWrapper}>
                <SidebarSkeleton />
              </View>
            ) : (
              <View style={styles.sidebarWrapper}>
                <Sidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryPress={(category: any) =>
                    setSelectedCategory(category)
                  }
                />
              </View>
            )}

            {/* ---------- PRODUCTS ---------- */}
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
    flexDirection: "column",
    flex: 1,
  },

  sidebarWrapper: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 0,
    borderColor: "#eee",
    paddingVertical: 0,
  },

  productsContainer: {
    flex: 1,
    width: "100%",
  },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategories));

