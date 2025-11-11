import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Share,
  FlatList,
  Dimensions,
} from 'react-native';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { RouteProp, useRoute } from '@react-navigation/native';
import UniversalAdd from '@components/ui/UniversalAdd';
import { getProductDetailById } from '@service/productService';
import Icon from 'react-native-vector-icons/Ionicons';
import WithCart from '@features/cart/WithCart';
import { goBack, navigate } from '@utils/NavigationUtils';
import FullScreenImageViewer from './FullScreenImageViewer';
import { useCartStore } from '@state/cartStore';



const { width } = Dimensions.get('window');
const imageHeight = width * 0.84;

const ProductDetail = () => {
  const route = useRoute<RouteProp<any>>();
  const productId = route.params?.productId;

  const Feature = ({ icon, label }: { icon: string; label: string }) => (
    <View style={styles.featureItem}>
      <Icon name={icon} size={24} color="green" />
      <CustomText variant="h8" style={{ textAlign: 'center', marginTop: 4 }}>{label}</CustomText>
    </View>
  );
  const cart = useCartStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.count, 0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductDetailById(productId);
      setProduct(data);
      setLoading(false);
    };
    if (productId) {fetchProduct();}
  }, [productId]);

  if (loading) {return <ActivityIndicator style={{ flex: 1 }} size="large" />;}
  if (!product || !product.productById) {return <CustomText variant="h7">Product not found.</CustomText>;}

  const p = product.productById;
  const images: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : p.image ? [p.image] : [];
  return (
    <View style={styles.fullContainer}>
      <View style={styles.topBar}>
        <View style={styles.topBarcheck}>
          <Pressable onPress={() => goBack()}>
            <Icon name="chevron-back" size={27} color="#000" />
          </Pressable>
        </View>
        <View style={styles.topRightIcons}>
           <TouchableOpacity style={styles.container} activeOpacity={0.8}
              onPress={() => navigate('SearchScreen', { startSearch: true })}
             >
          <Icon name="search" size={25} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const shareUrl = p.shareLink || `https://paltan.com/product/${p._id}`;
              const message = `Check out this product on paltan - ${p.name}\n${shareUrl}`;
              Share.share({ title: p.name, message }).catch(err => console.warn(err));
            }}
          >
            <Icon name="share-outline" size={25} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.upperContainer}>

      <ScrollView
       style={[styles.scroll, cartCount > 0 && { marginBottom: 27 }]}
      contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
      <View style={styles.imageSliderContainer}>
  <FlatList
    data={images}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item, index) => `${item}-${index}`}
    onMomentumScrollEnd={(e) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / width);
      setCurrentImageIndex(index);
    }}
    renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setSelectedImageIndex(index);
                  setFullScreenVisible(true);
                }}
              >
                <Image
                  source={item ? { uri: item } : require('@assets/images/background.jpg')}
                  style={[styles.image, { width, height: imageHeight }]}
                />
              </TouchableOpacity>
            )}
  />
</View>

<View style={styles.dotsWrapper}>
  {images.map((_, index) => (
    <View
      key={index}
      style={[styles.dot, currentImageIndex === index && styles.activeDot]}
    />
  ))}
</View>


       <View style={styles.detailsBox}>
  <View style={styles.Box}>
    <CustomText variant="h5" fontFamily={Fonts.Bold}>{p.name}</CustomText>
  </View>

  <View style={[styles.priceRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
    <View style={styles.priceInfo}>
      <CustomText variant="h8" fontFamily={Fonts.SemiBold}>MRP </CustomText>

      {p.discountprice ? (
        <>
          <CustomText variant="h8"  style={styles.strikePrice}>₹{p.price}</CustomText>
          <CustomText variant="h7" fontFamily={Fonts.Medium}>₹{p.discountprice}</CustomText>
        </>
      ) : (
        <CustomText variant="h7" fontFamily={Fonts.SemiBold}>₹{p.price}</CustomText>
      )}
    </View>

    <UniversalAdd item={p} />
  </View>




          <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={{ marginTop: 12 }}>
            <CustomText variant="h7" color="green">
              {showDetails ? 'Hide product details ▼' : 'View product details ▲'}
            </CustomText>
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.highlightsBox}>
              <CustomText variant="h6" fontFamily={Fonts.Bold}>Highlights</CustomText>

              <CustomText variant="h7">Unit</CustomText>
              <CustomText variant="h8" style={{ opacity: 0.7 }}>{p.quantity}</CustomText>

              <CustomText variant="h7" style={{ marginTop: 10 }}>Description</CustomText>
              <CustomText variant="h8" style={{ opacity: 0.7 }}>
                {product.description || 'No description available.'}
              </CustomText>

              <CustomText variant="h7" style={{ marginTop: 10 }}>Available Quantity</CustomText>
              <CustomText variant="h8" style={{ opacity: 0.7 }}>{product.numberOfQuantity}</CustomText>
            </View>
          )}

          <View style={styles.featuresRow}>
            <Feature icon="leaf" label="Sourced\nFresh Daily" />
            <Feature icon="checkmark-circle" label="Quality\nAssured" />
            <Feature icon="refresh-circle" label="48 hours\nReplacement" />
            <Feature icon="headset" label="24/7\nSupport" />
          </View>
        </View>

        <View style={styles.card}>
          <CustomText variant="h6" fontFamily={Fonts.Bold}>How to Use</CustomText>
          <CustomText variant="h7" style={{ marginBottom: 12 }}>Snacking</CustomText>

          <CustomText variant="h6" fontFamily={Fonts.Bold}>Health Benefits</CustomText>
          <CustomText variant="h7">Vitamin C Rich</CustomText>
        </View>
        <View style={styles.sectionContainer}>
          <CustomText variant="h6" fontFamily={Fonts.Bold}>Info</CustomText>

          <View style={styles.infoRow}>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>Shelf Life</CustomText>
            <CustomText variant="h7">2 days</CustomText>
          </View>

          <View style={styles.infoRow}>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>Return Policy</CustomText>
            <CustomText variant="h7">
              The product is non-returnable. For a damaged, rotten or incorrect item, you can request a replacement within 48 hours of delivery.{'\n'}
              In case of an incorrect item, you may raise a replacement or return request only if the item is sealed/unopened/unused and in original condition.
            </CustomText>
          </View>

          <View style={styles.infoRow}>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>Unit</CustomText>
            <CustomText variant="h7">{p.quantity}</CustomText>
          </View>

          <View style={styles.infoRow}>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>Country of Origin</CustomText>
            <CustomText variant="h7">India</CustomText>
          </View>

          <View style={styles.infoRow}>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>Customer Care Details</CustomText>
            <CustomText variant="h7">Email: info@blinkit.com</CustomText>
          </View>

          <View style={styles.infoRow}>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>Disclaimer</CustomText>
            <CustomText variant="h7">
              Image shown is a representation and may slightly vary from the actual product. Every effort is made to maintain accuracy of all information displayed.
            </CustomText>
          </View>

          <View style={styles.infoRow}>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>Seller</CustomText>
            <CustomText variant="h7">
              SUPERWELL COMTRADE PRIVATE LIMITED{'\n'}
              5 Calvin Road, 7/7 Lohia
            </CustomText>
          </View>

          <View style={styles.infoRow}>
            <CustomText variant="h7" fontFamily={Fonts.Medium}>Seller FSSAI</CustomText>
            <CustomText variant="h7">13323999000038</CustomText>
          </View>
        </View>
      </ScrollView>
       {fullScreenVisible && (
        <FullScreenImageViewer
          images={images}
          initialIndex={selectedImageIndex}
          onClose={() => setFullScreenVisible(false)}
        />
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
   priceRow: {
    marginRight:17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 0,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  strikePrice: {
    textDecorationLine: 'line-through',
    marginHorizontal: 6,
    color: 'gray',
    fontFamily:'90',
    fontWeight:500,
  },
  Box:{
marginRight:42,
  },
  upperContainer:{
    paddingTop:2,
  },
   imagecontainer: {
      borderRadius: 10,
      height:  0.14,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
    },
    image: {
      resizeMode: 'contain',
      width: '100%',
      height: '100%',
      aspectRatio: 0.1 / 0.1,
    },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  imageSliderContainer: {
  marginHorizontal:32,
},
dotsWrapper: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 1,
  marginBottom: 16,
},
dot: {
  height: 8,
  width: 8,
  borderRadius: 4,
  backgroundColor: '#ccc',
  marginHorizontal: 5,
  marginBottom:8,
},

activeDot: {
  backgroundColor: '#2e7d32',
},
  fullContainer: {
    flex: 1,
    marginBottom: 27,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  highlightsBox: {
    marginTop: 24,
  },
  scroll: {
    backgroundColor: '#f9f9f9',
  },
  container: {
    paddingBottom: 14,
  },

  topBar: {
    position: 'absolute',
    top: 4,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topBarcheck: {
    backgroundColor: 'rgba(77, 84, 84, 0.17)',
    borderRadius: 10,
    marginBottom:5,
  },
  topRightIcons: {
    flexDirection: 'row',
    gap: 7,
    paddingTop:3,
  },
  icon: {
    marginRight: 16,
  },
  detailsBox: {
    paddingTop:5,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  unit: {
    marginTop: 8,
    opacity: 0.6,
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoRow: {
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#2e7d32',
    margin: 16,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
});

export default WithCart(ProductDetail);