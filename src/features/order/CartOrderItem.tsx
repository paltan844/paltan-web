import React, { FC } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import UniversalAdd from '@components/ui/UniversalAdd';

interface CartOrderItemProps {
  item: {
    count: number;
    item: {
      _id: string;
      image: string;
      name: string;
      quantity: string;
      discountprice: number;
      price: string;
    };
  };
}

const CartOrderItem: FC<CartOrderItemProps> = ({ item }) => {
  return (
    <View style={styles.flexRow}>
      <View style={styles.imgContainer}>
        <Image source={{ uri: item.item.image }} style={styles.img} />
      </View>
      <View style={{ width: '49%' }}>
        <CustomText fontFamily={Fonts.Medium} variant="h8" numberOfLines={2}>
          {item.item.name}
        </CustomText>
        <CustomText variant="h9">{item.item.quantity}</CustomText>
      </View>
      <View style={{ paddingTop:15, width: '18%', alignItems: 'flex-end' }}>
        <UniversalAdd item={item.item} />
        <CustomText
          fontFamily={Fonts.Medium}
          variant="h8"
          style={{ alignSelf: 'flex-end', marginTop: 4 }}
        >

  ₹{item.count * (item.item.discountprice > 0
    ? item.item.discountprice
    : parseFloat(item.item.price))}
</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    backgroundColor: 'rgba(190, 184, 184, 1)',
    padding: 5,
    borderRadius: 10,
    width:'14%',
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderTopWidth: 0.6,
    borderTopColor: Colors.border,
  },
  img: {
    width: 33,
    height: 33,
  },
});

export default CartOrderItem;
