import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Share,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import UniversalAdd from '@components/ui/UniversalAdd';
import { goBack, navigate } from '@utils/NavigationUtils';
import { useCartStore } from '@state/cartStore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getProductByCategoryIdByMainId, getProductDetailById } from '@service/productService';
import FullScreenImageViewer from './FullScreenImageViewer';
import WithCart from '@features/cart/WithCart';
import KeyFeaturesModal from './KeyFeatureModal';
import ComparisonModal from './ComparisionModel';
import ProductList from './ProductList';
import { FlashList } from '@shopify/flash-list';

const { width } = Dimensions.get('window');
const imageHeight = 345.6;

const MobileDetail = () => {
  const route = useRoute<RouteProp<any>>();
  const productId = route.params?.productId;
  const categoryId = route.params?.categoryId;
const [modalVisible, setModalVisible] = useState(false);
const [isKeyFeaturesVisible, setIsKeyFeaturesVisible] = useState(false);
  const [extraDetails, setExtraDetails] = useState({
  });

const features = [
  { icon: 'cash', lines: ['COD', 'Available'] },
  { icon: 'checkmark-circle', lines: ['Quality', 'Assured'] },
  { icon: 'refresh-circle', lines: ['48 hours', 'Replacement'] },
  { icon: 'person', lines: ['24/7', 'Support'] },
];

  const cart = useCartStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.count, 0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, isSetLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        isSetLoading(true);
        const data = await getProductByCategoryIdByMainId(categoryId);
        setProducts(data);
      } catch (err) {
        console.warn('Error fetching products', err);
      } finally {
        isSetLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

useEffect(() => {
  const fetchProduct = async () => {
    const data = await getProductDetailById(productId);
    setProduct(data);

    if (true) {
      setExtraDetails({
        ingredients: data?.ingredients || [],
        howToUse: data?.howToUse || 'N/A',
        flavourNote: data?.flavourNote || 'N/A',
        NetworkType: data?.shelfLife || 'N/A',
        expandableStorage: data?.type || 'N/A',
        warranty: data?.warranty || 'N/A',
        returnPolicy: data?.returnPolicy || 'N/A',
        countryOfOrigin: data?.countryOfOrigin || 'N/A',
        seller: data?.seller || 'N/A',
        sellerAddress: data?.sellerAddress || 'N/A',
        sellerFSSAI: data?.sellerFSSAI || 'N/A',
        FSSAILicense: data?.FSSAILicense || 'N/A',
        display: data?.display || 'N/A',
        customerCareEmail: data?.customerCareEmail || 'N/A',
        inTheBox: data?.disclaimer || 'N/A',
      });
    }

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

  const handleShare = () => {
    const shareUrl = p.shareLink || `https://paltan.com/product/${p._id}`;
    const message = `Check out this product on paltan - ${p.name}\n${shareUrl}`;
    Share.share({ title: p.name, message }).catch(err => console.warn(err));
  };

  return (
    <>
    <View style={styles.fullContainer}>
      <View style={styles.topBar}>
        <View style={styles.topBarcheck}>
          <Pressable onPress={() => goBack()}>
            <Icon name="chevron-back" size={27} color="#000" />
          </Pressable>
        </View>
        <View style={styles.topRightIcons}>
          <TouchableOpacity onPress={() => navigate('SearchScreen', { startSearch: true })}>
            <Icon name="search" size={25} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Icon name="share-outline" size={25} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.upperContainer}>
        <ScrollView
          nestedScrollEnabled={true}
          style={[styles.scroll, cartCount > 0 && { marginBottom: 57 }]}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageSliderContainer}>
             <FlashList
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
    <View style={styles.modalkeupar}>
  <TouchableOpacity onPress={() => setIsKeyFeaturesVisible(true)}>
    <View style={styles.modal}>
         <Icon name="arrow-forward" size={20} color="white" style={styles.modalicon} />
    </View>
  </TouchableOpacity>
</View>

             <View style={styles.withline} />


         <View style={styles.detailsBox}>
  <View style={styles.titleContainer}>
    <View style={styles.nameContainer}>
      <CustomText variant="h5" fontFamily={Fonts.Bold}>
        {p.name}
      </CustomText>
    </View>

    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Icon name="git-compare-outline" size={20} color="#000" style={styles.titleIcons} />
      </TouchableOpacity>
    </View>
  </View>


            <View style={styles.priceRow}>
              <View style={styles.priceInfo}>
                <CustomText variant="h8" fontFamily={Fonts.SemiBold}>MRP </CustomText>
                {p.discountprice ? (
                  <>
                    <CustomText variant="h8" style={styles.strikePrice}>₹{p.price}</CustomText>
                    <CustomText variant="h7" fontFamily={Fonts.Medium}>₹{p.discountprice}</CustomText>
                  </>
                ) : (
                  <CustomText variant="h7" fontFamily={Fonts.SemiBold}>₹{p.price}</CustomText>
                )}
              </View>
              <View style={styles.add}>
              <UniversalAdd item={p} />
              </View>
            </View>
<View style={styles.featuresRow}>
  {features.map(({ icon, lines }, index) => (
    <View style={styles.featureItem} key={index}>
      <Icon name={icon} size={28} color="rgba(2, 5, 25, 0.57)" />
      {lines.map((line, idx) => (
        <CustomText
          key={idx}
          variant="h9"
          style={{
            textAlign: 'center',
            marginTop: idx === 0 ? 4 : 0,
            color: idx === 0 ? '#000' : undefined,
            fontWeight: idx === 0 ? 'bold' : 'normal',
          }}
        >
          {line}
        </CustomText>
      ))}
    </View>
  ))}
</View>


              <View style={styles.highlightsBox}>
                <View style={styles.highlights}>
                <CustomText variant="h5" fontFamily={Fonts.Bold} >Highlights</CustomText>
                </View>
                <CustomText variant="h7">Display</CustomText>
                <CustomText variant="h8" fontFamily={Fonts.SemiBold} style={{ opacity: 0.7 }}>{product.display}</CustomText>
                <CustomText variant="h7" style={{ marginTop: 10 }}>RAM | ROM</CustomText>
                <CustomText variant="h8" fontFamily={Fonts.SemiBold} style={{ opacity: 0.7 }}>
                  {product.dietType || 'Not available.'}
                </CustomText>
                <CustomText variant="h7" style={{ marginTop: 10 }}>Available Quantity</CustomText>
                <CustomText variant="h8" style={{ opacity: 0.7 }} fontFamily={Fonts.SemiBold}>{product.numberOfQuantity}</CustomText>
              </View>


            <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={{ marginTop: 12 }}>
              <CustomText variant="h7"  style={styles.hideshow}>
                {showDetails ? 'Hide product details ▼' : 'View product details ▲'}
              </CustomText>
            </TouchableOpacity>

          </View>

            {showDetails && (
  <>
    {Object.entries(extraDetails)
      .filter(
        ([key, value]) =>
          !['ingredients', 'flavourNote', 'howToUse'].includes(key) &&
          value !== 'N/A' &&
          value !== '' &&
          value !== null &&
          value !== undefined
      )
      .map(([key, value], index) => (
        <View style={styles.section} key={index}>
          <CustomText
            variant="h8"
            fontFamily={Fonts.SemiBold}
            style={{ marginBottom: 8 }}
          >
            {formatLabel(key)}
          </CustomText>
          {Array.isArray(value) ? (
            value.map((point, i) => (
              <CustomText key={i}>• {point}</CustomText>
            ))
          ) : (
            <CustomText>{value}</CustomText>
          )}

    </View>
))}


            </>
          )}
           <View style={styles.containers}>
      {isLoading ? (
        <ActivityIndicator color={Colors.primary} size="large" />
      ) : (
        <ProductList data={products} />
      )}
    </View>
        </ScrollView>

        {fullScreenVisible && (
          <FullScreenImageViewer
            images={images}
            initialIndex={selectedImageIndex}
            onClose={() => setFullScreenVisible(false)}
          />
        )}

        <KeyFeaturesModal
  visible={isKeyFeaturesVisible}
  onClose={() => setIsKeyFeaturesVisible(false)}
  extraDetails={extraDetails}
/>
 <ComparisonModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  ourProduct={{
    price: `₹${p.discountprice ? p.discountprice : p.price}`,
    deliveryCharges:
    product?.ourDeliveryCharges === 'N/A'
      ? 'N/A'
      : `₹${product?.ourDeliveryCharges}`,
  }}
  comparisonData={[
    { platform: 'Flipkart',
      price:
    product?.flipkartPrice === 'N/A'
      ? 'N/A'
      : `₹${product?.flipkartPrice}`,
        deliveryCharges:
    product?.flipkartDeliveryCharges === 'N/A'
      ? 'N/A'
      : `₹${product?.flipkartDeliveryCharges}`,
      },
    { platform: 'Amazon',
       price:
    product?.amazonPrice === 'N/A'
      ? 'N/A'
      : `₹${product?.amazonPrice}`,
       deliveryCharges:
    product?.amazonDeliveryCharges === 'N/A'
      ? 'N/A'
      : `₹${product?.amazonDeliveryCharges}`,
    },
    { platform: 'Zepto',
        price:
    product?.zeptoPrice === 'N/A'
      ? 'N/A'
      : `₹${product?.zeptoPrice}`,
        deliveryCharges:
    product?.zeptoDeliveryCharges === 'N/A'
      ? 'N/A'
      : `₹${product?.zeptoDeliveryCharges}`,
      },
    { platform: 'Blinkit',
         price:
    product?.blinkitPrice === 'N/A'
      ? 'N/A'
      : `₹${product?.blinkitPrice}`,
        deliveryCharges:
    product?.blinkitDeliveryCharges === 'N/A'
      ? 'N/A'
      : `₹${product?.blinkitDeliveryCharges}`,
      },
  ]}
/>
      </View>
    </View>

    </>
  );
};

const formatLabel = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

const styles = StyleSheet.create({
   containers: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  titleContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start', // aligns icons to the top
  //paddingHorizontal: 10,
 // marginBottom: 8,
},

nameContainer: {
  flex: 1,
 // paddingRight: 10,
},

iconContainer: {
  flexDirection: 'row',
},
titleIcons: {
  backgroundColor:'rgb(227, 219, 219)',
  borderRadius:6,
  padding:3,
  marginTop:8,
  marginLeft: 18,
},
titleIcon: {
   padding:3,
  marginTop:5,
  marginLeft: 8,
},
    modalkeupar:{
         flexDirection: 'row',
         justifyContent: 'flex-end',
          marginRight:10,
    },
    modal:{
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
      //  paddingBottom:3,
        height:18,
        width:53,
        backgroundColor:'rgba(16, 1, 1, 0.68)',
        justifyContent:'center',
        alignItems:'center',
    },
     modalicon:{
       marginTop:0,
    },
withline:{
    elevation:1,
    borderWidth:0.19,
    borderColor:'rgb(227, 141, 141)',
},
    add:{
  marginHorizontal:15,
  marginBottom:3,
    },
  fullContainer: { flex: 1, marginBottom: 2 },
  scroll: { backgroundColor: '#f9f9f9' },
  container: { flexGrow: 1, backgroundColor: '#fff' },
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
    marginBottom: 5,
  },
  topRightIcons: {
    flexDirection: 'row',
    gap: 7,
    paddingTop: 3,
  },
   label: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
  },
  value: {
    backgroundColor:'red',
    height:6,
    width:7,
    padding:10,

  },
  touchableValue: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  icon: { marginRight: 10 },
  upperContainer: { paddingTop: 2 },
  imageSliderContainer: {
     marginHorizontal: 32,
    },
  image: {
      resizeMode: 'contain',
      width: '100%',
      height: '100%',
      aspectRatio: 0.1 / 0.1,
    },
    hideshow:{
        backgroundColor:'rgba(114, 106, 106, 0.2)',
        width:'50%',
        paddingHorizontal:8,
        padding:5,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
      //  fontFamily:'900',
        fontWeight:'900',
    },
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  detailsBox: {
    paddingHorizontal: 16,

  },
  Box: {
    marginRight: 42,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  strikePrice: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  highlightsBox: {
    borderRadius:10,
    marginTop: 14,
    backgroundColor: 'rgba(225, 219, 219, 0.21)',
    padding:20,

  },
   highlights: {
    justifyContent:'center',
    alignItems:'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  featureItem: {
    marginHorizontal:2,
    borderRadius:10,
    padding:4,
    backgroundColor:'rgba(167, 161, 161, 0.14)',
     //borderWidth:2,
    alignItems: 'center',
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
});

export default WithCart(MobileDetail);
