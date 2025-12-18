import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@utils/Constants';
import ProductItem from './ProductItem';
import { useCartStore } from '@state/cartStore';
import { FlashList } from '@shopify/flash-list';

type Product = {
  _id: string;
  name: string;
  image: string;
  price?: number;
};

const ProductList: FC<{ data: Product[]; categoryId?: string }> = ({ data, categoryId }) => {
  const cart = useCartStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.count, 0);

  return (
    <View style={styles.wrapper}>
      <FlashList<Product>
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <ProductItem item={item} index={index} categoryId={categoryId} />
        )}
        numColumns={2}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: 'rgba(233, 242, 237, 0.5)',
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
});

export default ProductList;
