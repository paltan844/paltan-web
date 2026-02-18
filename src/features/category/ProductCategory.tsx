/*
import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import CustomHeader from "@components/ui/CustomHeader";
import FooterSidebar from "./FooterSidebar";
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
  const location = useLocation();

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

  const categoryName = selectedCategory?.name || "Categories";
  const canonicalUrl = `https://paltanshoppingmall.in${location.pathname}`;

  return (
    <View style={styles.mainContainer}>
      <Helmet>
        <title>
          Buy {categoryName} Online in Prayagraj | Paltan Shopping Mall
        </title>
        <meta
          name="description"
          content={`Order ${categoryName.toLowerCase()} online in Prayagraj from Paltan Shopping Mall. Fresh products, best prices and fast delivery.`}
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* ✅ Visible H1 (Blinkit style – simple & clean) /}
      <Text style={styles.h1}>
        {categoryName}
      </Text>

      <CustomHeader title={categoryName} search />

      {!isConnected ? (
        <NoConnectionScreen onRetry={onRetry} />
      ) : (
        <View style={styles.content}>
          {/* LEFT SIDEBAR /}
          <FooterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryPress={(cat) => {
              setSelectedCategory(cat);
              fetchProducts(cat._id);
            }}
          />

          <View style={{ width: 85 }} />

          {/* PRODUCTS /}
          <View style={{ flex: 1, paddingBottom: 80 }}>
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
  h1: {
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    color: "#111",
  },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategory));
*/

/*
//ye code slug se phle wala hai
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

  
  const categoryName = selectedCategory?.name || "Online Shopping";
  const categoryUrl =
    typeof window !== "undefined" ? window.location.href : "";


  return (
    <>
      <Helmet>
        <title>
          Buy {categoryName} Online in {CITY} | Best Prices | Paltan Shopping Mall
        </title>

        <meta
          name="description"
          content={`Buy ${categoryName} online in ${CITY} at best price. Fast delivery, fresh products and easy returns from Paltan Shopping Mall.`}
        />

        <link rel="canonical" href={categoryUrl} />

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
        <CustomHeader title={categoryName} search />

        {!isConnected ? (
          <NoConnectionScreen onRetry={onRetry} />
        ) : (
          <View style={styles.content}>
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

            <View style={{ width: 85 }} />

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
  getMainCategoryBySlug,
} from "@service/productService";

import WithCart from "@features/cart/WithCart";
import NoConnectionScreen from "@components/common/NetworkHandler";
import { withNetworkHandlerWithHeader } from "@components/common/withNetworkHandler";

const CITY = "Prayagraj";

const ProductCategory: FC<{ isConnected?: boolean; onRetry: () => void }> = ({
  isConnected,
  onRetry,
}) => {
  const { slug } = useParams<{ slug: string }>();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

useEffect(() => {

  if (!slug) {
    return;
  }


  (async () => {
    try {
      setLoading(true);
      const mainCategory = await getMainCategoryBySlug(slug);

      if (!mainCategory || !mainCategory._id) {
        setLoading(false);
        return;
      }

      const data = await getAllCategoriesByMainCategoryId(mainCategory._id);

      if (!data || data.length === 0) {

        setCategories([mainCategory]);
        setSelectedCategory(mainCategory);
        fetchProducts(mainCategory._id);
      } else {
        setCategories(data);
        setSelectedCategory(data[0]);
        fetchProducts(data[0]._id);
      }

      setLoading(false);
    } catch (err) {
      console.error("🔥 useEffect crash:", err);
      setLoading(false);
    }
  })();
}, [slug]);


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

  const categoryName = selectedCategory?.name || "Online Shopping";

  const categoryUrl =
    typeof window !== "undefined" && selectedCategory?.slug
      ? `https://paltanshoppingmall.in/productcategory/${selectedCategory.slug}`
      : "";

  return (
    <>
      <Helmet>
        <title>
          Buy {categoryName} Online in {CITY} | Best Prices | Paltan Shopping Mall
        </title>

        <meta
          name="description"
          content={`Buy ${categoryName} online in ${CITY} at best price. Fast delivery, fresh products and easy returns from Paltan Shopping Mall.`}
        />

        <link rel="canonical" href={categoryUrl} />

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
        <CustomHeader title={categoryName} search />

        {!isConnected ? (
          <NoConnectionScreen onRetry={onRetry} />
        ) : (
          <View style={styles.content}>
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

            <View style={{ width: 85 }} />

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
