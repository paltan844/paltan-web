import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@utils/Constants';
import ProductItem from './ProductItem';
import { useCartStore } from '@state/cartStore';
import { FlashList } from '@shopify/flash-list';

const ProductList: FC<{ data: any; categoryId?: string }> = ({ data, categoryId }) => {
  const cart = useCartStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.count, 0);

  const renderItem = ({ item, index }: any) => {
    return <ProductItem item={item} index={index} categoryId={categoryId} />;
  };

  return (
    <View style={styles.wrapper}>
      <FlashList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
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
