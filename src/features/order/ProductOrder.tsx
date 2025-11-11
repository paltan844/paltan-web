import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import React, { FC, useState } from "react";
import CustomHeader from "@components/ui/CustomHeader";
import { Colors, Fonts } from "@utils/Constants";
import OrderList from "./OrderList";
import { calculatePriceSummary } from "@utils/priceUtils";
import { createOrders, createTransaction } from "@features/cart/api/paygateway";
import PaymentSelectModal from "./PaymentModal";
import { useLocationStore } from "@state/locationStore";
import { cleanAddress } from "@utils/CleanAddress";
import ArrowButton from "@components/ui/ArrowButton";
import { navigate } from "@utils/NavigationUtils";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@components/ui/CustomText";
import { useCartStore } from "@state/cartStore";
import BillDetails from "./BillDetails";
import { hocStyles } from "@styles/globalStyles";
import { useAuthStore } from "@state/authStore";
import { createOrder, getOrderById } from "@service/orderService";
import {
  formatAddressForBackend,
  formatSelectedLocation,
} from "@utils/AddressPreview";
import OfferModal from "./OfferModal";
import { RiCoupon2Line } from "react-icons/ri";
// ✅ React Icons (for web)
import {
  MdChevronRight,
  MdDiscount,
  MdHome,
  MdLocalOffer,
  MdSell,
} from "react-icons/md";

const ProductOrder: FC = () => {
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const { getTotalPrice, cart, clearCart } = useCartStore();
  const { user, setUser, setCurrentOrder, currentOrder } = useAuthStore();
  const totalItemPrice = getTotalPrice();
  const [loading, setLoading] = useState(false);
  const [errorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const { selectedLocation, selectedLocationObject } = useLocationStore();

  let { totalMRP, totalDiscountPrice, productDiscount } =
    calculatePriceSummary(cart);
  let finalAmount = totalDiscountPrice;

  if (selectedOffer) {
    if (selectedOffer.discountType === "percent") {
      const discount = (finalAmount * selectedOffer.discountValue) / 100;
      finalAmount = Math.max(0, finalAmount - discount);
    } else if (selectedOffer.discountType === "flat") {
      finalAmount = Math.max(0, finalAmount - selectedOffer.discountValue);
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true);

    if (!user) {
      Alert.alert("Please login to place your order");
      setLoading(false);
      return;
    }
    if (!selectedLocation) {
      Alert.alert("Please select a delivery address");
      setLoading(false);
      return;
    }

    if (currentOrder !== null) {
      try {
        await getOrderById(currentOrder._id);
      } catch {
        setCurrentOrder(null);
      }
    }

    const formattedData = cart.map((item) => ({
      id: item._id,
      item: item._id,
      count: item.count,
    }));

    if (formattedData.length === 0) {
      Alert.alert("Add any items to place order");
      setLoading(false);
      return;
    }

    const formattedLocation = formatAddressForBackend(selectedLocationObject);

    try {
      if (paymentMethod === "cod") {
        const order = await createOrder(
          formattedData,
          totalItemPrice,
          formattedLocation
        );
        if (order) {
          clearCart();
          setCurrentOrder(order);
          setUser({ ...user, address: selectedLocation });
          navigate("OrderSuccess", {
            price: totalItemPrice,
            address: selectedLocation,
          });
        } else {
          Alert.alert("Order creation failed");
        }
      } else {
        const transaction = await createTransaction(totalItemPrice, user._id);
        if (!transaction) {
          Alert.alert("Transaction creation failed");
          setLoading(false);
          return;
        }

        const result = await createOrders(
          transaction.key,
          transaction.amount,
          transaction.order_id,
          formattedData,
          user._id,
          formattedLocation
        );

        if (result?.type === "error") {
          Alert.alert("Payment Failed", result.message);
        } else {
          clearCart();
          setCurrentOrder(result.order);
          setUser({ ...user, address: selectedLocation });
          navigate("OrderSuccess", {
            price: totalItemPrice,
            address: selectedLocation,
          });
        }
      }
    } catch {
      Alert.alert("Something went wrong");
    }
    setLoading(false);
  };

  const handleSelectPayment = () => setPaymentModalVisible(true);

  return (
    <>
      <View style={styles.container}>
        <CustomHeader title="Checkout" />

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <CustomText variant="h6" style={styles.errorText}>
              {errorMessage}
            </CustomText>
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <OrderList />

          {/* ✅ Coupons Section */}
          <TouchableOpacity
            onPress={() => setOfferModalVisible(true)}
            style={styles.couponContainer}
            activeOpacity={0.7}
          >
            <View style={styles.flexRow}>
            <RiCoupon2Line size={15} color={Colors.secondary} />
              <CustomText
                fontFamily={Fonts.SemiBold}
                variant="h8"
               
              >
                Use Coupons
              </CustomText>
            </View>

            {selectedOffer ? (
              <CustomText
                fontFamily={Fonts.SemiBold}
                variant="h9"
                style={{ color: Colors.secondary }}
              >
                {selectedOffer.title}
              </CustomText>
            ) : (
              <MdChevronRight size={18} color={Colors.text} />
            )}
          </TouchableOpacity>

          <BillDetails
            totalItemPrice={totalDiscountPrice}
            totalMRP={totalMRP}
            productDiscount={productDiscount}
          />

         <View style={styles.cancellationContainer}>
  <CustomText
    fontFamily={Fonts.Medium}
    variant="h7"
    style={styles.cancellationHeader}
  >
    Cancellation Policy
  </CustomText>

  <CustomText
    fontFamily={Fonts.Regular}
    variant="h9"
    style={styles.cancellationText}
  >
    Orders cannot be cancelled once packed for delivery. In case of unexpected
    delays, a refund will be provided if applicable.
  </CustomText>
</View>

        </ScrollView>

        {/* ✅ Bottom section */}
        <View style={hocStyles.cartcontainer}>
          <View style={styles.absoluteContainer}>
            <View style={styles.addressContainer}>
              <View style={styles.flexRow}>
                <MdHome size={20} color={Colors.lightcolor} />
                <View style={{ width: "75%" }}>
                  <CustomText fontFamily={Fonts.Medium} variant="h8">
                    {" "}
                    Delivery to Home
                  </CustomText>
                  <CustomText
                    numberOfLines={2}
                    variant="h9"
                    style={{ opacity: 0.6 }}
                  >
                    {selectedLocation
                      ? cleanAddress(formatSelectedLocation(selectedLocation))
                      : "No address selected"}
                  </CustomText>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  navigate("LocationSelector", { source: "productorder" })
                }
              >
                <CustomText
                  fontFamily={Fonts.Medium}
                  variant="h8"
                  style={{ color: Colors.secondary }}
                >
                  Change
                </CustomText>
              </TouchableOpacity>
            </View>

            <View style={styles.paymentGateway}>
              <TouchableOpacity
                onPress={handleSelectPayment}
                style={[
                  styles.paymentBox,
                  {
                    borderColor:
                      paymentMethod === "cod" ? "#2ecc71" : "#3498db",
                  },
                ]}
              >
                <CustomText fontSize={RFValue(6)} fontFamily={Fonts.Regular}>
                  💲 PAY USING
                </CustomText>
                <CustomText
                  fontFamily={Fonts.SemiBold}
                  variant="h9"
                  style={{
                    marginTop: 2,
                    color:
                      paymentMethod === "cod" ? "#2ecc71" : "#3498db",
                  }}
                >
                  {paymentMethod === "cod"
                    ? "💵 Cash on Delivery"
                    : "💳 Online Payment"}
                </CustomText>
              </TouchableOpacity>

              <View style={{ width: "70%" }}>
                <ArrowButton
                  loading={loading}
                  price={finalAmount}
                  title="Proceed to Pay"
                  onPress={handlePlaceOrder}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ✅ Modals */}
      <PaymentSelectModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onSelect={(method) => setPaymentMethod(method)}
        selected={paymentMethod}
      />

      <OfferModal
        visible={offerModalVisible}
        onClose={() => setOfferModalVisible(false)}
        onSelect={(offer) => {
          setSelectedOffer(offer);
          setOfferModalVisible(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  paymentBox: {
    height: "79%",
    width: "30%",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: "#f9f9f9",
  },
  errorBanner: {
    backgroundColor: "#ff4d4f",
    padding: 10,
    margin: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  errorText: {
    color: "white",
    fontFamily: Fonts.SemiBold,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    paddingBottom: 180,
  },
  cancellationContainer: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 5,
  marginTop: 0,
  marginBottom: 0,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
},

cancellationHeader: {
  marginBottom: 3,
  color: Colors.text,
},

cancellationText: {
  color: "rgba(0,0,0,0.6)",
  lineHeight: 11,
},

  flexRowBetween: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  paymentGateway: {
    paddingLeft: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexRow: {
    flexDirection: "row",
    alignContent: "center",
    gap: 10,
  },
  cancelText: {
    marginTop: 4,
    opacity: 0.6,
  },
  addressContainer: {
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderColor: Colors.border,
    borderBottomWidth: 0.7,
  },
  absoluteContainer: {
    marginVertical: 15,
    marginBottom: Platform.OS === "ios" ? 30 : 10,
  },
  couponContainer: {
    padding: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default ProductOrder;
