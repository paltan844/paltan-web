import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import UniversalAdd from '@components/ui/UniversalAdd';
import { getProductByCategoryIdByMainId } from '@service/productService';
import WithCart from '@features/cart/WithCart';
import FullScreenImageViewer from './FullScreenImageViewer';
import { useCartStore } from '@state/cartStore';
import { FlashList } from '@shopify/flash-list';
import {
  ArrowLeft,
  Search,
  Share2,
  IndianRupee,
  GitCompare,
  BadgeCheck,
  RefreshCcw,
  User
} from "lucide-react";

import { useLocation, useNavigate } from 'react-router-dom';

const { width } = Dimensions.get('window');

const ProductDetail = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const locState: any = (location && (location as any).state) || {};
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(location.search)
      : new URLSearchParams('');

  const productId = locState?.productId || searchParams.get('productId');
  const categoryId = locState?.categoryId || searchParams.get('categoryId');

  const features = [
    { icon: 'card-outline', lines: ['COD', 'Available'] },
    { icon: 'shield-checkmark-outline', lines: ['Quality', 'Assured'] },
    { icon: 'refresh-outline', lines: ['48 hours', 'Replacement'] },
    { icon: 'people-outline', lines: ['24/7', 'Support'] },
  ];

  const cart = useCartStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.count, 0);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, isSetLoading] = useState<boolean>(true);

  const [showDetails, setShowDetails] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


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

    if (categoryId) fetchProducts();
    else {
      setProducts([]);
      isSetLoading(false);
    }
  }, [categoryId]);


  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!product || !product.productById) {
    return <CustomText variant="h7">Product not found.</CustomText>;
  }


  const p = {
    ...product.productById,
    _id: product.productById?._id || product.productById?.id,
  };

  const images: string[] =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : p.image ? [p.image] : [];

  const handleShare = () => {
    const shareUrl = p.shareLink || `https://paltan.com/product/${p._id}`;
    const message = `Check out this product on paltan - ${p.name}\n${shareUrl}`;

    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      (navigator as any)
        .share({ title: p.name, text: message, url: shareUrl })
        .catch((err: any) => console.warn(err));
    } else {
      try {
        if ((navigator as any).clipboard) {
          (navigator as any).clipboard.writeText(message);
          alert('Product link copied to clipboard');
        } else {
          alert(message);
        }
      } catch (err) {
        console.warn('Share fallback failed', err);
      }
    }
  };


  return (
    <>
      <View style={styles.fullContainer}>

        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View style={styles.topBarcheck}>
           <Pressable onPress={() => navigate(-1 as any)}> 
              <ArrowLeft size={27} color="#000" />
            </Pressable>
          </View>

          <View style={styles.topRightIcons}>
            <TouchableOpacity onPress={() => navigate('/searchscreen', { state: { startSearch: true } })}>
              <Search size={25} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare}>
              <Share2 size={25} color="#000" />
            </TouchableOpacity>
          </View>
        </View>


        {/* MAIN BODY */}
        <View style={styles.upperContainer}>
          <ScrollView
            nestedScrollEnabled={true}
            style={[styles.scroll, cartCount > 0 && { marginBottom: 57 }]}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >

            {/* IMAGE SLIDER */}
            <View style={styles.imageSliderContainer}>
              <FlashList
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${item}-${index}`}
                estimatedItemSize={width}
                onScroll={(e) => {
                  const x = e.nativeEvent.contentOffset.x;
                  const index = Math.round(x / width);
                  if (index !== currentImageIndex) {
                    setCurrentImageIndex(index);
                  }
                }}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setFullScreenVisible(true)}
                    style={styles.imageTouchArea}
                  >
                    <Image source={{ uri: item }} style={styles.centeredImage} />
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* DOTS */}
            <View style={styles.dotsWrapper}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentImageIndex === index && styles.activeDot
                  ]}
                />
              ))}
            </View>


            {/* DETAILS */}
            <View style={styles.detailsBox}>

              <View style={styles.titleContainer}>
                <View style={styles.nameContainer}>
                  <CustomText variant="h5" fontFamily={Fonts.Bold}>{p.name}</CustomText>
                </View>


                {/* PRICE + ADD */}
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

                  <View >
                    <UniversalAdd item={p} />
                  </View>
                </View>



                {/* SHOW DETAILS */}
                <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={{ marginTop: 12 }}>
                  <CustomText variant="h7" >
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


                {/* FEATURES */}
                <View style={styles.featuresRow}>
                  {features.map(({ icon, lines }, index) => (
                    <View style={styles.featureItem} key={index}>
                      {icon === "card-outline" && (
                        <IndianRupee size={28} color="rgba(2, 5, 25, 0.57)" />
                      )}
                      {icon === "shield-checkmark-outline" && (
                        <BadgeCheck size={28} color="rgba(2, 5, 25, 0.57)" />
                      )}
                      {icon === "refresh-outline" && (
                        <RefreshCcw size={28} color="rgba(2, 5, 25, 0.57)" />
                      )}
                      {icon === "people-outline" && (
                        <User size={28} color="rgba(2, 5, 25, 0.57)" />
                      )}

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

              </View>
            </View>



            {/* EXTRA SECTIONS */}
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
                  The product is non-returnable. For a damaged, rotten or incorrect item, you can request a replacement within 48 hours.{'\n'}
                  For incorrect items, only if sealed/unopened & original condition.
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
                <CustomText variant="h7" fontFamily={Fonts.Medium}>Customer Care</CustomText>
                <CustomText variant="h7">info@blinkit.com</CustomText>
              </View>

              <View style={styles.infoRow}>
                <CustomText variant="h7" fontFamily={Fonts.Medium}>Disclaimer</CustomText>
                <CustomText variant="h7">
                  Image is for representation. Actual product may vary slightly.
                </CustomText>
              </View>

              <View style={styles.infoRow}>
                <CustomText variant="h7" fontFamily={Fonts.Medium}>Seller</CustomText>
                <CustomText variant="h7">
                  SUPERWELL COMTRADE PRIVATE LIMITED{'\n'}5 Calvin Road
                </CustomText>
              </View>

              <View style={styles.infoRow}>
                <CustomText variant="h7" fontFamily={Fonts.Medium}>Seller FSSAI</CustomText>
                <CustomText variant="h7">13323999000038</CustomText>
              </View>

            </View>
          </ScrollView>


          {/* FULL SCREEN IMAGE VIEWER */}
          {fullScreenVisible && (
            <FullScreenImageViewer
              images={images}
              initialIndex={selectedImageIndex}
              onClose={() => setFullScreenVisible(false)}
            />
          )}

        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  priceRow: {
    marginRight: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  upperContainer: {
    paddingTop: 2,
  },
  

imageTouchArea: {
  width,
  height: 300,
  justifyContent: "center",
  alignItems: "center",
},

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  nameContainer: {
    flex: 1,
  },


centeredImage: {
  width: width * 0.75,      // image chhota
  height: 260,               // perfect center height
  resizeMode: "contain",
  alignSelf: "center",
},

  imageSliderContainer: {
    marginHorizontal: 32,
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
    marginBottom: 8,
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
    backgroundColor: 'rgba(77,84,84,0.17)',
    borderRadius: 10,
    marginBottom: 5,
  },
  topRightIcons: {
    flexDirection: 'row',
    gap: 7,
    paddingTop: 3,
  },
  detailsBox: {
    paddingTop: 5,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
  },
  infoRow: {
    marginBottom: 14,
  },
});

export default WithCart(ProductDetail);
