import {
  View,
  ScrollView,
  StyleSheet,
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
import { useAuthStore } from "@state/authStore";
import { createOrder, getOrderById } from "@service/orderService";
import {
  formatAddressForBackend,
  formatSelectedLocation,
} from "@utils/AddressPreview";
import OfferModal from "./OfferModal";
import type { Offer } from "@service/productService";

// Web Icons
import { RiCoupon2Line } from "react-icons/ri";
import { MdChevronRight, MdHome } from "react-icons/md";

const ProductOrder: FC = () => {
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const [appliedOffer, setAppliedOffer] = useState<{
    discount: number;
    finalTotal: number;
    couponCode: string;
    title: string;
    reason?: string;
  } | null>(null);



  const { getTotalPrice, cart, clearCart } = useCartStore();
  const { user, setUser, setCurrentOrder, currentOrder } = useAuthStore();
  const totalItemPrice = getTotalPrice();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const { selectedLocation, selectedLocationObject } = useLocationStore();


  let { totalMRP, totalDiscountPrice, productDiscount } =
    calculatePriceSummary(cart);

  const cartTotal = totalDiscountPrice;
  const finalAmount = appliedOffer?.finalTotal ?? cartTotal;

  const showAlert = (msg: any) => {
    if (Platform.OS === "web") window.alert(String(msg));
    else Alert.alert(String(msg));
  };


  const handlePlaceOrder = async () => {
    setLoading(true);

    if (!user) {
      showAlert("Please login to place your order");
      setLoading(false);
      return;
    }

    if (!selectedLocation) {
      showAlert("Please select a delivery address");
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
      showAlert("Add any items to place order");
      setLoading(false);
      return;
    }

    const formattedLocation = formatAddressForBackend(selectedLocationObject);

    try {
      if (paymentMethod === "cod") {
        const order = await createOrder(
          formattedData,
          finalAmount,
          formattedLocation
        );

        if (order) {
          clearCart();
          setCurrentOrder(order);
          setUser({ ...user, address: selectedLocation });

          navigate("/ordersuccess", {
            state: {
              price: finalAmount,
              address: selectedLocation,
            },
          });
        } else {
          showAlert("Order creation failed");
        }
      } else {
        const transaction = await createTransaction(finalAmount, user._id);
        if (!transaction) {
          showAlert("Transaction failed");
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
          showAlert(`Payment Failed: ${result.message}`);
        } else {
          clearCart();
          setCurrentOrder(result.order);
          setUser({ ...user, address: selectedLocation });

          navigate("/ordersuccess", {
            state: {
              price: finalAmount,
              address: selectedLocation,
            },
          });
        }
      }
    } catch (e) {
      console.error("❌ handlePlaceOrder error:", e);
      showAlert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <>
      <View style={styles.container}>
        <CustomHeader title="Checkout" />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <OrderList />

          {selectedOffer && appliedOffer ? (
            <View style={styles.couponAppliedBox}>
              <View>
                <CustomText
                  fontFamily={Fonts.SemiBold}
                  variant="h8"
                  style={{ color: Colors.secondary }}
                >
                  Coupon Code: {appliedOffer.couponCode}
                </CustomText>

                <CustomText
                  fontFamily={Fonts.Medium}
                  variant="h9"
                  style={{ opacity: 0.7, marginTop: 2 }}
                >
                  PALTAN Offer applied 🎉 You saved ₹{appliedOffer.discount}
                </CustomText>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setSelectedOffer(null);
                  setAppliedOffer(null);
                }}
                style={styles.removeBtn}
              >
                <CustomText
                  fontFamily={Fonts.SemiBold}
                  variant="h9"
                  style={{ color: "#FF3B30" }}
                >
                  Remove
                </CustomText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setOfferModalVisible(true)}
              style={styles.couponContainer}
            >
              <View style={styles.flexRow}>
                <RiCoupon2Line size={15} color={Colors.secondary} />
                <CustomText fontFamily={Fonts.SemiBold} variant="h8">
                  Use Coupons
                </CustomText>
              </View>

              <MdChevronRight size={18} color={Colors.text} />
            </TouchableOpacity>
          )}

          <BillDetails
            totalItemPrice={cartTotal}
            totalMRP={totalMRP}
            productDiscount={productDiscount}
            offerDiscount={appliedOffer?.discount ?? 0}
            grandTotal={finalAmount}
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
              Orders cannot be cancelled once packed for delivery. In case of
              unexpected delays, a refund will be provided if applicable.
            </CustomText>
          </View>
        </ScrollView>

        <View style={styles.fixedBottomWrapper}>
          <View style={styles.addressContainer}>
            <View style={styles.addressLeft}>
              <MdHome size={20} color={Colors.lightcolor} />

              <View style={styles.addressTextWrapper}>
                <CustomText fontFamily={Fonts.Medium} variant="h8">
                  Delivery to Home
                </CustomText>

                <CustomText
                  numberOfLines={2}
                  variant="h9"
                  style={{ opacity: 0.6, marginTop: 2 }}
                >
                  {selectedLocation
                    ? cleanAddress(
                        formatSelectedLocation(selectedLocation as string)
                      )
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
  onPress={() => setPaymentModalVisible(true)}
  style={[
    styles.paymentBox,
    {
      borderColor: paymentMethod === "cod" ? "#2ecc71" : "#3498db",
    },
  ]}
>
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    {/* LEFT SIDE */}
    <View style={{ flexDirection: "column" }}>

      {/* PAY USING + ARROW IN SAME ROW */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <CustomText fontSize={RFValue(7)} style={{ opacity: 0.8 }}>
          💲 PAY USING
        </CustomText>

        {/* Arrow with background */}
        <View
          style={{
            //backgroundColor: Colors.secondary,
           // padding: 1,
            borderRadius: 6,
          }}
        >
          <MdChevronRight size={16} color="#190101ff"  style={{ transform: "rotate(-90deg)" }}/>
        </View>
      </View>

      {/* Payment Method (below) */}
      <CustomText
        fontFamily={Fonts.SemiBold}
        variant="h9"
        style={{
          marginTop: 3,
          color: paymentMethod === "cod" ? "#2ecc71" : "#3498db",
        }}
      >
        {paymentMethod === "cod"
          ? "💵 Cash on Delivery"
          : "💳 Online Payment"}
      </CustomText>
    </View>
  </View>
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

      <PaymentSelectModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onSelect={(method) => setPaymentMethod(method)}
        selected={paymentMethod}
      />

      <OfferModal
        visible={offerModalVisible}
        onClose={() => setOfferModalVisible(false)}
        onSelect={({ offer, discount, finalTotal, reason }) => {
          setSelectedOffer(offer);
          setAppliedOffer({
            discount,
            finalTotal,
            couponCode: offer.couponCode,
            title: offer.title,
            reason,
          });
          setOfferModalVisible(false);
        }}
        selectedOfferId={selectedOffer?._id}
        cartTotal={cartTotal}
        userId={user?._id}
        isFirstOrder={user?.isFirstOrder}
      />
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 170,
  },

  scrollContainer: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },

  flexRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  couponContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  couponAppliedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F0FFF4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2ecc7144",
    marginBottom: 12,
  },

  removeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  fixedBottomWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    zIndex: 999,
    elevation: 14,
  },
  addressContainer: {
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  addressLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  addressTextWrapper: {
    width: "75%",
  },
  paymentGateway: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  paymentBox: {
    height: "79%",
    width: "30%",
    padding: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: "#f9f9f9",
  },
  cancellationContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    marginBottom: 16,
  },

  cancellationHeader: { marginBottom: 4, color: Colors.text },
  cancellationText: { opacity: 0.6, lineHeight: 14 },
});

export default ProductOrder;
