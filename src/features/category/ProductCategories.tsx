/*
import { View, StyleSheet } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ Replaces useRoute
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

interface Props {
  isConnected?: boolean;
  onRetry?: () => void;
}

const ProductCategories: FC<Props> = ({ isConnected, onRetry }) => {
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
  (cat:any) => cat._id === passedCategory?._id
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
            <SidebarSkeleton />
          ) : (
            <Sidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryPress={(category: any) => setSelectedCategory(category)}
            />
          )}

          <View style={styles.productsContainer}>
            {productsLoading ? (
              <ProductListSkeleton />
            ) : products.length > 0 ? (
              <ProductList data={products} />
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
  productsContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
  },
  center: {
    color: "blue",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategories));   */

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
  (cat:any) => cat._id === passedCategory?._id
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
            <SidebarSkeleton />
          ) : (
            <Sidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryPress={(category: any) => setSelectedCategory(category)}
            />
          )}

          <View style={styles.productsContainer}>
            {productsLoading ? (
              <ProductLoader />
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
  productsContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
    // flexDirection: "row",
  },
  center: {
    color: "blue",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default withNetworkHandlerWithHeader(WithCart(ProductCategories));
*/




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

          {/* ------- TOP SIDEBAR (FULL WIDTH) ------- */}
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

          {/* ------- PRODUCTS SECTION (FULL WIDTH) ------- */}
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

