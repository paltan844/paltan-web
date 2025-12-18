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
          
          {/* ⭐ FIXED SIDEBAR (actual sidebar stays separate) */}
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
