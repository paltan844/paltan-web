import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import CustomText from '@components/ui/CustomText';
import EmptyProductListFooter from '@features/category/EmptyProductListFooter';
import UniversalAdd from '@components/ui/UniversalAdd';
import { navigate } from '@utils/NavigationUtils';

interface SearchResultsProps {
 results: {
  id: number;
  name: string;
  price: number;
  mrp: number;
  rating: number;
  image: string;
  discountprice: string;
  categoryId?: string;
  navigateTo?: string;
}[];
  loading: boolean;
  numColumns?: number;
}

const SearchResults: FC<SearchResultsProps> = ({ results, loading,numColumns }) => {
  const [showEmpty, setShowEmpty] = useState(false);

 useEffect(() => {
    if (!loading && results?.length === 0) {
      const timer = setTimeout(() => {
        setShowEmpty(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowEmpty(false);
    }
  }, [results, loading]);

  const handleKeyboardDismiss = () => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
  };


  if (showEmpty) {
    return <EmptyProductListFooter />;
  }


  const handleNavigation = (item: any) => {
    const route = item?.CategoryById?.navigateTo;
    const categoryIdToSend = item?.categoryId;

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
      case 'sports':
        navigate('SportsDetail', { productId: item._id });
        break;
      case 'others':
        navigate('OthersDetail', { productId: item._id });
        break;
      default:
        navigate('ProductDetail', { productId: item._id });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        )}

        <FlashList
          data={results}
          numColumns={numColumns || 2}
          renderItem={({ item }) => (
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
                    {item.name} ({item?.quantity})
                  </Text>

                  <View style={styles.priceContainer}>
                    {item.discountprice ? (
                      <>
                        <CustomText style={styles.discountedPrice}>
                          ₹{item.discountprice}
                        </CustomText>
                        <View style={styles.mrpContainer}>
                          <Text style={styles.mrp}>MRP:</Text>
                          <Text style={styles.mrpPrice}> ₹{item.price}</Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <CustomText style={styles.discountedPrice}> </CustomText>
                        <View style={styles.mrpContainer}>
                          <Text style={styles.mrp}>MRP:</Text>
                          <Text style={styles.discountedPrice}> ₹{item.price}</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.addToCartButton}>
                  <UniversalAdd item={item} />
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          estimatedItemSize={200}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    width: '100%',
    paddingHorizontal: 6,
    marginTop: 4,
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(239, 12, 12, 0.03)',
  },
  loadingContainer: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productContainer: {
    marginTop: 3,
    flex: 1,
    borderWidth: 0.2,
    borderBottomWidth: 0.2,
    borderColor:  'rgba(239, 12, 12, 0.03)',
    borderRadius: 3,
  },
  product: {
    paddingVertical: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    height: 130,
    width: 128,
    overflow: 'hidden',
    marginTop: 0,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'rgba(105, 105, 119, 0.2)',
  },
  productImage: {
    height: '90%',
    width: '80%',
    backgroundColor: 'transparent',
  },
  productName: {
    height: 35,
    width: 120,
    fontWeight: '500',
    fontSize: 11,
    marginTop: 0,
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 0,
  },
  mrpPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: 'black',
  },
  discountedPrice: {
    color: 'green',
    fontSize: 13,
    marginTop: 0,
  },
  mrpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrp: {
    fontSize: 13,
    color: 'black',
    fontWeight: '500',
  },
  addToCartButton: {
    marginTop: 2,
    borderWidth: 2,
    borderColor: 'pink',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(8, 37, 3, 0.68)',
  },
});

export default SearchResults;
