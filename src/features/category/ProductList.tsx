import React, { FC, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Colors } from "@utils/Constants";
import ProductItem from "./ProductItem";
import { useCartStore } from "@state/cartStore";
import { FlashList } from "@shopify/flash-list";

type Product = {
  _id: string;
  name: string;
  image: string;
  price?: number;
};

interface Props {
  data: Product[];
  categoryId?: string;
  hasMore?: boolean;
  loadingMore?: boolean;
  onEndReached?: () => void;
}

const ProductList: FC<Props> = ({
  data,
  categoryId,
  hasMore = false,
  loadingMore = false,
  onEndReached,
}) => {
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.count, 0);

  const [numColumns, setNumColumns] = useState(2);

  /* =========================
     Responsive Column Logic
  ========================== */
  useEffect(() => {
    const updateColumns = () => {
      const width = Dimensions.get("window").width;

      if (width >= 1250) setNumColumns(7);
      else if (width >= 1050) setNumColumns(6);
      else if (width >= 850) setNumColumns(5);
      else if (width >= 650) setNumColumns(4);
      else setNumColumns(2);
    };

    updateColumns();

    const subscription = Dimensions.addEventListener(
      "change",
      updateColumns
    );

    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.wrapper}>
      <FlashList<Product>
        key={numColumns} 
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <ProductItem
            item={item}
            index={index}
            categoryId={categoryId}
          />
        )}
        numColumns={numColumns}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasMore && !loadingMore && onEndReached) {
            onEndReached();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color="#1E90FF" />
            </View>
          ) : null
        }
        contentContainerStyle={{
          backgroundColor: "rgba(233, 242, 237, 0.5)",
          paddingVertical: 10,
          paddingBottom: cartCount > 0 ? 59 : 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  loader: {
    paddingVertical: 15,
    alignItems: "center",
  },
});

export default ProductList;
