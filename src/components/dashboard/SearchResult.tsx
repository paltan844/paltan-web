import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import CustomText from "@components/ui/CustomText";
import EmptyProductListFooter from "@features/category/EmptyProductListFooter";
import UniversalAdd from "@components/ui/UniversalAdd";
import { navigate } from "@utils/NavigationUtils";


interface CategoryInfo {
  _id: string;
  navigateTo: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  discountprice?: string;
  image: string;
  quantity?: string;

  CategoryById?: CategoryInfo;
  categoryId?: string;
  navigateTo?: string;
}

/* ===============================
   ✅ PROPS TYPE
================================ */

interface SearchResultsProps {
  results: Product[];
  loading: boolean;
  numColumns?: number;
}

/* ===============================
   ✅ COMPONENT
================================ */

const SearchResults: FC<SearchResultsProps> = ({
  results,
  loading,
  numColumns = 2,
}) => {
  const [showEmpty, setShowEmpty] = useState(false);

  useEffect(() => {
    if (!loading && results.length === 0) {
      const timer = setTimeout(() => setShowEmpty(true), 1200);
      return () => clearTimeout(timer);
    } else {
      setShowEmpty(false);
    }
  }, [results, loading]);

  if (showEmpty) {
    return <EmptyProductListFooter />;
  }

  /* ===============================
     ✅ SAFE NAVIGATION HANDLER
  ================================= */

  const handleNavigation = (item: Product) => {
    const route =
      item.CategoryById?.navigateTo ||
      item.navigateTo ||
      null;

    const categoryIdToSend =
      item.CategoryById?._id ||
      item.categoryId ||
      null;

    switch (route) {
      case "grocery":
        navigate("GroceryProductDetail", {
          productId: item._id,
          categoryId: categoryIdToSend,
        });
        break;

      case "electronics":
        navigate("MobileDetail", {
          productId: item._id,
          categoryId: categoryIdToSend,
        });
        break;

      case "furniture":
        navigate("FurnitureDetail", {
          productId: item._id,
        });
        break;

      case "wear":
        navigate("WearDetail", {
          productId: item._id,
        });
        break;

      case "sports":
        navigate("SportsDetail", {
          productId: item._id,
        });
        break;

      case "others":
        navigate("OthersDetail", {
          productId: item._id,
        });
        break;

      default:
        navigate("ProductDetail", {
          productId: item._id,
        });
    }
  };

  /* ===============================
     ✅ RENDER ITEM (STRICT SAFE)
  ================================= */

  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <View style={styles.productContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.product}
        onPress={() => handleNavigation(item)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={styles.productName}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.name}
            {item.quantity ? ` (${item.quantity})` : ""}
          </Text>

          <View style={styles.priceContainer}>
            {item.discountprice ? (
              <>
                <CustomText style={styles.discountedPrice}>
                  ₹{item.discountprice}
                </CustomText>
                <View style={styles.mrpContainer}>
                  <Text style={styles.mrp}>MRP:</Text>
                  <Text style={styles.mrpPrice}>
                    ₹{item.price}
                  </Text>
                </View>
              </>
            ) : (
              <CustomText style={styles.discountedPrice}>
                ₹{item.price}
              </CustomText>
            )}
          </View>
        </View>

        <View style={styles.addToCartButton}>
          <UniversalAdd item={item} />
        </View>
      </TouchableOpacity>
    </View>
  );

  /* ===============================
     ✅ RETURN
  ================================= */

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        )}

        <FlashList<Product>
  key={numColumns} // ⭐ IMPORTANT FIX
  data={results}
  renderItem={renderItem}
  keyExtractor={(item) => item._id}
  estimatedItemSize={200}
  numColumns={numColumns}
  keyboardShouldPersistTaps="always"
  showsVerticalScrollIndicator
  contentContainerStyle={{ paddingBottom: 10 }}
/>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchResults;

/* ===============================
   ✅ STYLES
================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(239, 12, 12, 0.03)",
  },
  loadingContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  productContainer: {
    marginTop: 3,
    flex: 1,
    borderWidth: 0.2,
    borderBottomWidth: 0.2,
    borderColor: "rgba(239, 12, 12, 0.03)",
    borderRadius: 3,
  },
  product: {
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: "white",
  },
  imageContainer: {
    height: 130,
    width: 128,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "rgba(105,105,119,0.2)",
  },
  productImage: {
    height: "90%",
    width: "80%",
    resizeMode: "contain",
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: 6,
    marginTop: 4,
  },
  productName: {
    height: 35,
    width: 120,
    fontWeight: "500",
    fontSize: 11,
  },
  priceContainer: {
    marginTop: 2,
  },
  discountedPrice: {
    color: "green",
    fontSize: 13,
  },
  mrpContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mrp: {
    fontSize: 13,
    fontWeight: "500",
  },
  mrpPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "black",
  },
  addToCartButton: {
    marginTop: 2,
    borderWidth: 2,
    borderColor: "pink",
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(8, 37, 3, 0.68)",
  },
});