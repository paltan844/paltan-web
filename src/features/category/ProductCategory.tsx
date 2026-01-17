/*
import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useParams } from "react-router-dom";
import CustomHeader from "@components/ui/CustomHeader";
import FooterSidebar from "./FooterSidebar";
import FooterSidebarSkeleton from "./FooterSidebarSkeleton";
import ProductList from "./ProductList";
import ProductListSkeleton from "./ProductListSkeleton";
import EmptyProductListFooter from "./EmptyProductListFooter";
import {
  getAllCategoriesByMainCategoryId,
  getProductByCategoryIdByMainId,
} from "@service/productService";
import WithCart from "@features/cart/WithCart";
import NoConnectionScreen from "@components/common/NetworkHandler";
import { withNetworkHandlerWithHeader } from "@components/common/withNetworkHandler";

const ProductCategory: FC<{ isConnected?: boolean; onRetry: () => void }> = ({
  isConnected,
  onRetry,
}) => {
  const { id: categoryId } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    (async () => {
      setLoading(true);
      const data = await getAllCategoriesByMainCategoryId(categoryId);

      if (!data?.length) {
        setCategories([{ _id: categoryId }]);
        setSelectedCategory({ _id: categoryId });
        fetchProducts(categoryId);
      } else {
        setCategories(data);
        setSelectedCategory(data[0]);
        fetchProducts(data[0]._id);
      }

      setLoading(false);
    })();
  }, [categoryId]);

  const fetchProducts = async (catId: string) => {
    try {
      setProductsLoading(true);
      const data = await getProductByCategoryIdByMainId(catId);
      setProducts(data || []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title={selectedCategory?.name || "Categories"} search />

      {!isConnected ? (
        <NoConnectionScreen onRetry={onRetry} />
      ) : (
        <View style={styles.content}>
          
          {/* ⭐ FIXED SIDEBAR (actual sidebar stays separate) /}
          <FooterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryPress={(cat) => {
              setSelectedCategory(cat);
              fetchProducts(cat._id);
            }}
          />
          <View style={{ width: 85 }} />

<View style={{ flex: 1, justifyContent: 'center', paddingBottom: 80 }}>
  {productsLoading ? (
    <ProductListSkeleton />
  ) : products.length > 0 ? (
    <ProductList data={products} categoryId={selectedCategory?._id} />
  ) : (
    <EmptyProductListFooter />
  )}
</View>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, flexDirection: "row" },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategory));
*/



      
import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import CustomHeader from "@components/ui/CustomHeader";
import FooterSidebar from "./FooterSidebar";
import FooterSidebarSkeleton from "./FooterSidebarSkeleton";
import ProductList from "./ProductList";
import ProductListSkeleton from "./ProductListSkeleton";
import EmptyProductListFooter from "./EmptyProductListFooter";

import {
  getAllCategoriesByMainCategoryId,
  getProductByCategoryIdByMainId,
} from "@service/productService";

import WithCart from "@features/cart/WithCart";
import NoConnectionScreen from "@components/common/NetworkHandler";
import { withNetworkHandlerWithHeader } from "@components/common/withNetworkHandler";

const CITY = "Prayagraj";

const ProductCategory: FC<{ isConnected?: boolean; onRetry: () => void }> = ({
  isConnected,
  onRetry,
}) => {
  const { id: categoryId } = useParams();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  /* -------------------- DATA FETCH -------------------- */
  useEffect(() => {
    if (!categoryId) return;

    (async () => {
      setLoading(true);

      const data = await getAllCategoriesByMainCategoryId(categoryId);

      if (!data?.length) {
        setCategories([{ _id: categoryId, name: "Products" }]);
        setSelectedCategory({ _id: categoryId, name: "Products" });
        fetchProducts(categoryId);
      } else {
        setCategories(data);
        setSelectedCategory(data[0]);
        fetchProducts(data[0]._id);
      }

      setLoading(false);
    })();
  }, [categoryId]);

  const fetchProducts = async (catId: string) => {
    try {
      setProductsLoading(true);
      const data = await getProductByCategoryIdByMainId(catId);
      setProducts(data || []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  /* -------------------- SEO VALUES -------------------- */
  const categoryName = selectedCategory?.name || "Online Shopping";
  const categoryUrl =
    typeof window !== "undefined" ? window.location.href : "";

  /* -------------------- UI -------------------- */
  return (
    <>
      {/* 🔥 SEO BLOCK (NO UI IMPACT) */}
      <Helmet>
        <title>
          Buy {categoryName} Online in {CITY} | Best Prices | Paltan Shopping Mall
        </title>

        <meta
          name="description"
          content={`Buy ${categoryName} online in ${CITY} at best price. Fast delivery, fresh products and easy returns from Paltan Shopping Mall.`}
        />

        <link rel="canonical" href={categoryUrl} />

        {/* Category Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${categoryName} in ${CITY}`,
            url: categoryUrl,
            isPartOf: {
              "@type": "WebSite",
              name: "Paltan Shopping Mall",
              url: "https://paltanshoppingmall.in",
            },
          })}
        </script>
      </Helmet>

      {/* 🔒 Invisible H1 for Google (Blinkit-style) */}
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
        <CustomHeader title={categoryName} search />

        {!isConnected ? (
          <NoConnectionScreen onRetry={onRetry} />
        ) : (
          <View style={styles.content}>
            {/* ⭐ FIXED SIDEBAR */}
            {loading ? (
              <FooterSidebarSkeleton />
            ) : (
              <FooterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryPress={(cat) => {
                  setSelectedCategory(cat);
                  fetchProducts(cat._id);
                }}
              />
            )}

            {/* sidebar space */}
            <View style={{ width: 85 }} />

            {/* PRODUCTS */}
            <View style={{ flex: 1, justifyContent: "center", paddingBottom: 80 }}>
              {productsLoading ? (
                <ProductListSkeleton />
              ) : products.length > 0 ? (
                <ProductList
                  data={products}
                  categoryId={selectedCategory?._id}
                />
              ) : (
                <EmptyProductListFooter />
              )}
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
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategory));

