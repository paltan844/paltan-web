/*
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
    minHeight: 20,
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
*/



//slug se phle ka code
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { screenHeight } from "@utils/Scaling";
import CustomText from "@components/ui/CustomText";
import { Fonts } from "@utils/Constants";
import { navigate } from "@utils/NavigationUtils";
import UniversalAdd from "@components/ui/UniversalAdd";
import { useCartStore } from "@state/cartStore";

const CITY = "Prayagraj";

const ProductItem: FC<{
  item: any;
  index: number;
  categoryId?: string;
}> = ({ index, item, categoryId }) => {
  const isSecondColoumn = index % 2 !== 0;

  const { getItemCount } = useCartStore();
  getItemCount(item._id); 

  const handleNavigation = () => {
    const route = item?.CategoryById?.navigateTo;

    switch (route) {
      case "grocery":
        navigate("GroceryProductDetail", {
          productId: item._id,
          categoryId,
        });
        break;
      case "electronics":
        navigate("MobileDetail", {
          productId: item._id,
          categoryId,
        });
        break;
      case "furniture":
        navigate("FurnitureDetail", { productId: item._id });
        break;
      case "wear":
        navigate("WearDetail", { productId: item._id });
        break;
      case "others":
        navigate("OthersDetail", { productId: item._id });
        break;
      default:
        navigate("ProductDetail", { productId: item._id });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleNavigation}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Buy ${item.name} online in ${CITY}`}
        style={[styles.container, { marginRight: isSecondColoumn ? 10 : 0 }]}
      >
    
        <View style={styles.imagecontainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            alt={item.name} // ✅ RN Web → <img alt="">
          />
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

      
          <View
            style={{
              position: "absolute",
              left: -9999,
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
            accessible={false}
          >
            <CustomText>
              Buy {item.name} online in {CITY} at best price from Paltan Shopping
              Mall
            </CustomText>
          </View>

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
                    style={{
                      opacity: 0.8,
                      textDecorationLine: "line-through",
                    }}
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

            <UniversalAdd item={item} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "99%",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    marginLeft: 14,
    overflow: "hidden",
    minHeight: 20,
  },
  imagecontainer: {
    width: "100%",
    borderRadius: 10,
    height: screenHeight * 0.14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    overflow: "hidden",
    backgroundColor: "rgba(174, 174, 186, 0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
    aspectRatio: 1 / 1,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 7,
    justifyContent: "space-between",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default ProductItem;


/*
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { screenHeight } from "@utils/Scaling";
import CustomText from "@components/ui/CustomText";
import { Fonts } from "@utils/Constants";
import { navigate } from "@utils/NavigationUtils";
import UniversalAdd from "@components/ui/UniversalAdd";
import { useCartStore } from "@state/cartStore";

const CITY = "Prayagraj";

const ProductItem: FC<{
  item: any;
  index: number;
  categoryId?: string;
}> = ({ index, item, categoryId }) => {
  const isSecondColoumn = index % 2 !== 0;
  const { getItemCount } = useCartStore();

  // ✅ cart logic untouched
  getItemCount(item._id);

  const handleNavigation = () => {
    console.log("🟢 Product clicked:", item.name);
    console.log("🟢 Slug:", item.slug);

    // 🔐 Safety check
    if (!item.slug) {
      console.error("❌ Slug missing for product:", item._id);
      return;
    }

    // ✅ RN WEB → URL based navigation (VERY IMPORTANT)
    navigate(`/product/${item.slug}`, {
      state: {
        productId: item._id,
        categoryId,
        slug: item.slug,
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleNavigation}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Buy ${item.name} online in ${CITY}`}
        style={[styles.container, { marginRight: isSecondColoumn ? 10 : 0 }]}
      >
        <View style={styles.imagecontainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            alt={item.name} // RN Web SEO
          />
        </View>

      
        <View style={styles.content}>
          <CustomText
            fontFamily={Fonts.Medium}
            variant="h8"
            numberOfLines={3}
            style={{ marginVertical: 4 }}
          >
            {item.name} ({item.quantity})
          </CustomText>

    
          <View
            style={{
              position: "absolute",
              left: -9999,
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
            accessible={false}
          >
            <CustomText>
              Buy {item.name} online in {CITY} at best price
            </CustomText>
          </View>

          <View style={{ flexGrow: 1 }} />

        
          <View style={styles.priceRow}>
            <View>
              {item.discountprice ? (
                <>
                  <CustomText fontFamily={Fonts.SemiBold} variant="h7">
                    ₹{item.discountprice}
                  </CustomText>
                  <CustomText
                    variant="h8"
                    style={{
                      textDecorationLine: "line-through",
                      opacity: 0.7,
                    }}
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

            <UniversalAdd item={item} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "99%",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    marginLeft: 14,
    overflow: "hidden",
  },
  imagecontainer: {
    height: screenHeight * 0.14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(174,174,186,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 7,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ProductItem;
*/

