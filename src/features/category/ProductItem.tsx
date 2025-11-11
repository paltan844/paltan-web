import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';
import { screenHeight } from '@utils/Scaling';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { navigate } from '@utils/NavigationUtils';
import UniversalAdd from '@components/ui/UniversalAdd';
import { useCartStore } from '@state/cartStore';

const ProductItem: FC<{ item: any; index: number; categoryId?: string }> = ({ index, item, categoryId }) => {
  const isSecondColoumn = index % 2 !== 0;

  const { getItemCount } = useCartStore();
  const qtyInCart = getItemCount(item._id);

  const handleNavigation = () => {
    const route = item?.CategoryById?.navigateTo;
    const categoryIdToSend = categoryId;

    switch (route) {
      case 'grocery':
        navigate('GroceryProductDetail', {
          productId: item._id,
          categoryId: categoryIdToSend,
        });
        break;
      case 'electronics':
        navigate('MobileDetail', {
          productId: item._id,
          categoryId: categoryIdToSend,
        });
        break;
      case 'furniture':
        navigate('FurnitureDetail', { productId: item._id });
        break;
      case 'wear':
        navigate('WearDetail', { productId: item._id });
        break;
      case 'others':
        navigate('OthersDetail', { productId: item._id });
        break;
      default:
        navigate('ProductDetail', { productId: item._id });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleNavigation}
        activeOpacity={0.8}
        style={[styles.container, { marginRight: isSecondColoumn ? 10 : 0 }]}
      >
        <View style={styles.imagecontainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <CustomText
            fontFamily={Fonts.Medium}
            variant="h8"
            numberOfLines={3}
            style={{ marginVertical: 4 }}
          >
            {item.name} ({item?.quantity})
          </CustomText>

          <View style={{ flexGrow: 1 }} />

          <View style={styles.priceRow}>
            <View>
              {item?.discountprice ? (
                <>
                  <CustomText fontFamily={Fonts.SemiBold} variant="h7">
                    ₹{item.discountprice}
                  </CustomText>
                  <CustomText
                    fontFamily={Fonts.SemiBold}
                    variant="h8"
                    style={{ opacity: 0.8, textDecorationLine: 'line-through' }}
                  >
                    ₹{item.price}
                  </CustomText>
                </>
              ) : (
                <CustomText fontFamily={Fonts.SemiBold} variant="h7">
                  ₹{item.price}
                </CustomText>
              )}
            </View>

<UniversalAdd item={item}/>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '99%',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    marginLeft: 14,
    overflow: 'hidden',
    minHeight: 220,
  },
  imagecontainer: {
    width: '100%',
    borderRadius: 10,
    height: screenHeight * 0.14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    overflow: 'hidden',
    backgroundColor: 'rgba(174, 174, 186, 0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1 / 1,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 7,
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ProductItem;
