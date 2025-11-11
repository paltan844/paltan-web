import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useParams, useLocation } from "react-router-dom"; // ✅ use this instead
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

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface Props {
  isConnected?: boolean;
  onRetry?: () => void;
}

const EMPTY_STATE_DELAY = 3000;

const ProductCategory: FC<Props> = ({ isConnected, onRetry }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showEmptyFooter, setShowEmptyFooter] = useState(false);

  // ✅ Replace useRoute with useLocation (state) or useParams
  const { state } = useLocation();
  const passedCategory = state?.category; // receiving via navigate(path, { state: { category } })

  useEffect(() => {
    if (passedCategory?.id) fetchCategories();
  }, [passedCategory?.id]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await getAllCategoriesByMainCategoryId(passedCategory?.id);
      setCategories(data || []);
      setSelectedCategory(data?.[0] || null);
    } catch (error) {
      console.error("❌ Error Fetching Categories:", error);
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
      console.error("❌ Error Fetching Products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory?._id) fetchProducts(selectedCategory._id);
    else setProducts([]);
  }, [selectedCategory]);

  useEffect(() => {
    if (!productsLoading && products.length === 0) {
      const timer = setTimeout(() => setShowEmptyFooter(true), EMPTY_STATE_DELAY);
      return () => clearTimeout(timer);
    }
    setShowEmptyFooter(false);
  }, [productsLoading, products]);

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title={selectedCategory?.name || "Categories"} search />

      {!isConnected ? (
        <NoConnectionScreen onRetry={onRetry || fetchCategories} />
      ) : (
        <View style={styles.content}>
          {categoriesLoading ? (
            <FooterSidebarSkeleton />
          ) : (
            <FooterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryPress={setSelectedCategory}
            />
          )}

          <View style={styles.productsContainer}>
            {productsLoading ? (
              <ProductListSkeleton />
            ) : products.length > 0 ? (
              <ProductList data={products} categoryId={selectedCategory?._id} />
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
  content: {
    flex: 1,
    flexDirection: "row",
  },
  productsContainer: {
    flex: 1,
  },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategory));






/*
import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import CustomHeader from '@components/ui/CustomHeader';
import FooterSidebar from './FooterSidebar';
import FooterSidebarSkeleton from './FooterSidebarSkeleton';
import ProductList from './ProductList';
import ProductListSkeleton from './ProductListSkeleton';
import EmptyProductListFooter from './EmptyProductListFooter';
import WithCart from '@features/cart/WithCart';
import { NoConnectionScreen } from '@components/common/NetworkHandler';
import { withNetworkHandlerWithHeader } from '@components/common/withNetworkHandler';
import { useProductStore } from '@state/useProductStore';

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

type ProductCategoryRouteParams = {
  ProductCategory: {
    category: {
      id: string;
      name: string;
      icon: string;
      navigateTo?: string;
    };
  };
};

interface Props {
  isConnected?: boolean;
  onRetry?: () => void;
}

const ProductCategory: FC<Props> = ({ isConnected, onRetry }) => {
  const route = useRoute<RouteProp<ProductCategoryRouteParams, 'ProductCategory'>>();
  const passedCategory = route.params?.category;

  const {
    categories,
    products,
    loading,
    fetchCategories,
    fetchProducts,
    clearCache,
  } = useProductStore();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const currentCategories = categories[passedCategory?.id] || [];
  const currentProducts = selectedCategory ? products[selectedCategory._id] || [] : [];


  useEffect(() => {
    if (passedCategory?.id) {
      fetchCategories(passedCategory.id);
    }
  }, [passedCategory?.id]);

  useEffect(() => {
    if (selectedCategory?._id) {
      fetchProducts(selectedCategory._id);
    } else if (currentCategories.length > 0) {
      setSelectedCategory(currentCategories[0]);
    }
  }, [selectedCategory?._id, currentCategories]);


  const onRefresh = async () => {
    setRefreshing(true);
    clearCache();
    await fetchCategories(passedCategory.id, true);
    if (selectedCategory?._id) {
      await fetchProducts(selectedCategory._id, true);
    }
    setRefreshing(false);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title={selectedCategory?.name || 'Categories'} search />

      {!isConnected ? (
        <NoConnectionScreen onRetry={onRetry || (() => fetchCategories(passedCategory?.id, true))} />
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007bff']} />
          }
        >
          <View style={styles.content}>
            {loading && currentCategories.length === 0 ? (
              <FooterSidebarSkeleton />
            ) : (
              <FooterSidebar
                categories={currentCategories}
                selectedCategory={selectedCategory || currentCategories[0]}
                onCategoryPress={setSelectedCategory}
              />
            )}

            <View style={styles.productsContainer}>
              {loading && currentProducts.length === 0 ? (
                <ProductListSkeleton />
              ) : currentProducts.length > 0 ? (
                <ProductList data={currentProducts} categoryId={selectedCategory?._id} />
              ) : (
                <EmptyProductListFooter />
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  productsContainer: {
    flex: 1,
  },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategory));
*/