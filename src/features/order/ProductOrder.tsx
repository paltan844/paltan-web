import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
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
import { createOrder, estimateBill, getOrderById } from "@service/orderService";
import {
  formatAddressForBackend,
  formatSelectedLocation,
} from "@utils/AddressPreview";
import OfferModal from "./OfferModal";
import type { Offer } from "@service/productService";

// Web Icons
import { RiCoupon2Line } from "react-icons/ri";
import { MdChevronRight, MdHome } from "react-icons/md";
import BillSkeleton from "./BillSkelton";

type CartItem = {
  id: string;
  item: string;
  count: number;
  categoryId?: string | null;
};


type BillSummary = {
  totalMRP: number;
  subtotal: number;
  productDiscount: number;
  offerDiscount: number;
  grandTotal: number;
  deliveryCharge: number;

  appliedOffer?: {
    applied: boolean;
    couponCode: string | null;
    discount: number;
    freeDelivery?: boolean;
    offer?: {
      _id: string;
      title: string;
      discountType: "flat" | "percent" | "free_delivery" | "bogo" | "bank";
    };
  };
};

type CartCategory =
  | string
  | {
      _id: string;
      name?: string;
      image?: string;
      navigateTo?: string;
    };

type CartItemFromStore = {
  _id: string;
  count: number;
  categoryId?: CartCategory;
};




const ProductOrder: FC = () => {
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const { getTotalPrice, cart, clearCart } = useCartStore();
  const { user, setUser, setCurrentOrder, currentOrder } = useAuthStore();
  const totalItemPrice = getTotalPrice();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const { selectedLocation, selectedLocationObject } = useLocationStore();
const [billSummary, setBillSummary] = useState<BillSummary | null>(null);
const [couponCode, setCouponCode] = useState<string | null>(null);
const [billLoading, setBillLoading] = useState(false);

const orderCount = user?.orderCount ?? 0;



const formattedItems: CartItem[] = (cart as CartItemFromStore[]).map(
  (item) => {
    return {
      id: String(item._id),
      item: String(item._id),
      count: item.count,
      categoryId:
        typeof item.categoryId === "string"
          ? item.categoryId
          : item.categoryId && "_id" in item.categoryId
          ? String(item.categoryId._id)
          : null,
    };
  }
);



useEffect(() => {
  if (formattedItems.length === 0) {
    setBillSummary(null);
    return;
  }

  setBillLoading(true);

  estimateBill(formattedItems, couponCode)
    .then((res) => {
      if (!res?.success || !res.bill) {
        setBillSummary(null);
        return;
      }

      const bill = res.bill;

      setBillSummary({
        totalMRP: Number(bill.totalMRP) || 0,
        subtotal: Number(bill.subtotal) || 0,
        productDiscount: Number(bill.productDiscount) || 0,
        offerDiscount: Number(bill.offerDiscount) || 0,
        deliveryCharge: Number(bill.deliveryCharge) || 0,
        grandTotal: Number(bill.grandTotal) || 0,
        appliedOffer: bill.appliedOffer,
      });
    })
    .catch(() => {
      setBillSummary(null);
    })
    .finally(() => {
      setBillLoading(false);
    });
}, [cart, couponCode]);


  const showAlert = (msg: string) => {
    if (Platform.OS === "web") alert(msg);
    else Alert.alert(msg);
  };


  

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      if (!user) {
        showAlert("Please login to place your order");
        return;
      }

      if (!selectedLocationObject) {
        showAlert("Please select delivery address");
        return;
      }

      if (formattedItems.length === 0) {
        showAlert("Cart is empty");
        return;
      }

      if (currentOrder) {
        try {
          await getOrderById(currentOrder._id);
        } catch {
          setCurrentOrder(null);
        }
      }

      const deliveryAddress = {
        latitude: selectedLocationObject.latitude,
        longitude: selectedLocationObject.longitude,
        fullAddress: selectedLocationObject.fullAddress,
        receiverName: selectedLocationObject.receiverName,
        receiverMobile: selectedLocationObject.receiverMobile,
      };

      /* ---------------- COD ---------------- */
      if (paymentMethod === "cod") {
        const order = await createOrder({
          items: formattedItems,
          branch: selectedLocationObject.branchId,
          deliveryAddress,
          couponCode,
        });

        if (!order) {
          showAlert("Order creation failed");
          return;
        }

        clearCart();
        setCurrentOrder(order);
        setUser({ ...user, address: selectedLocation });

        navigate("OrderSuccess", {
          price: order.finalAmount,
          address: selectedLocation,
        });
        return;
      }

      /* ---------------- ONLINE ---------------- */
      if (!billSummary) {
        showAlert("Unable to calculate bill");
        return;
      }

      const transaction = await createTransaction(
        billSummary.grandTotal,
        user._id
      );

      if (!transaction) {
        showAlert("Transaction failed");
        return;
      }

      const result = await createOrders(
        transaction.key,
        transaction.amount,
        transaction.order_id,
        formattedItems,
        user._id,
        deliveryAddress,
        couponCode
      );

      if (result?.type === "error") {
        showAlert(result.message);
        return;
      }

      clearCart();
      setCurrentOrder(result.order);
      setUser({ ...user, address: selectedLocation });

      navigate("OrderSuccess", {
        price: result.order.finalAmount,
        address: selectedLocation,
      });
    } catch (e) {
      console.error("❌ Place order error:", e);
      showAlert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <View style={styles.container}>
        <CustomHeader title="Checkout" />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <OrderList />

          
{billSummary?.appliedOffer?.applied ? (
  <View style={styles.couponAppliedBox}>
    <View>
      <CustomText fontFamily={Fonts.SemiBold} variant="h8">
        Coupon Applied: {billSummary.appliedOffer.couponCode}
      </CustomText>

      {billSummary.appliedOffer.offer?.discountType === "bogo" && (
        <CustomText style={{ color: "#2ECC71", fontSize: RFValue(11) }}>
          Buy 1 Get 1 Free
        </CustomText>
      )}

      {billSummary.appliedOffer.offer?.discountType === "free_delivery" && (
        <CustomText style={{ color: "#2ECC71", fontSize: RFValue(11) }}>
          Free Delivery Applied
        </CustomText>
      )}

      {billSummary.appliedOffer.offer?.discountType === "percent" && (
        <CustomText style={{ color: "#2ECC71", fontSize: RFValue(11) }}>
          Percentage Discount Applied
        </CustomText>
      )}
    </View>

    <TouchableOpacity
      onPress={() => setCouponCode(null)}
      style={styles.removeBtn}
    >
      <CustomText style={{ color: "#FF3B30" }}>Remove</CustomText>
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
    <MdChevronRight size={18} />
  </TouchableOpacity>
)}

{/* BILL SECTION */}
{billLoading ? (
  <BillSkeleton />
) : billSummary ? (
  <BillDetails
    subtotal={billSummary.subtotal}
    totalMRP={billSummary.totalMRP}
    productDiscount={billSummary.productDiscount}
    offerDiscount={billSummary.offerDiscount}
    deliveryCharge={billSummary.deliveryCharge}
    grandTotal={billSummary.grandTotal}
    appliedOffer={billSummary.appliedOffer}
  />
) : null}

          

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
               price={billSummary?.grandTotal ?? 0}
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
  onSelect={(code) => setCouponCode(code)}
  cartSubtotal={billSummary?.subtotal ?? 0}   // ✅ IMPORTANT
  orderCount={orderCount}
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