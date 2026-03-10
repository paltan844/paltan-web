import { View, StyleSheet, Image } from "react-native";
import React, { FC } from "react";
import { Colors, Fonts } from "@utils/Constants";
import CustomText from "@components/ui/CustomText";
import BillDetails from "@features/order/BillDetails";
import OrderDetails from "@features/order/orderDetails";
import { calculatePriceSummary } from "@utils/priceUtils";
import { ShoppingBag, ImageOff } from "lucide-react";

const OrderSummary: FC<{ order: any }> = ({ order }) => {
  const { totalMRP, totalDiscountPrice, productDiscount } =
    calculatePriceSummary(order?.items || []);
const bill = order?.billSummary;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconBox}>
            <ShoppingBag size={22} strokeWidth={1.5} color="#6c6c6c" />
          </View>

          <View>
            <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
              Order Summary
            </CustomText>
            <CustomText
              variant="h9"
              fontFamily={Fonts.Medium}
              style={{ color: "#555" }}
            >
              Order ID - #{order?.orderId}
            </CustomText>
          </View>
        </View>

        {order?.items?.map((item: any, index: number) => {
          const product = item?.item;
          if (!product) return null;

          const hasDiscount = parseFloat(item.item.discountprice) > 0;

          return (
            <View style={styles.itemRow} key={index}>
              {/* Image */}
              <View style={styles.imgContainer}>
                {product.image ? (
                  <Image source={{ uri: product.image }} style={styles.img} />
                ) : (
                  <ImageOff size={16} color={Colors.border} />
                )}
              </View>

              {/* Name + qty */}
              <View style={{ width: "55%" }}>
                <CustomText
                  numberOfLines={2}
                  variant="h8"
                  fontFamily={Fonts.Medium}
                >
                  {product.name || "Unnamed Product"}
                </CustomText>

                <CustomText
                  variant="h9"
                  fontFamily={Fonts.Regular}
                  style={{ color: "#555" }}
                >
                  {product.quantity || "—"}
                </CustomText>
              </View>

              {/* Pricing */}
              <View style={{ width: "22%", alignItems: "flex-end" }}>
                <View style={styles.priceRow}>
                  {hasDiscount ? (
                    <>
                      <CustomText
                        variant="h8"
                        fontFamily={Fonts.Medium}
                        style={styles.striked}
                      >
                        ₹{parseFloat(item.item.price) * item.count}
                      </CustomText>

                      <CustomText
                        variant="h8"
                        fontFamily={Fonts.Medium}
                        style={{ color: "#111" }}
                      >
                        ₹{parseFloat(item.item.discountprice) * item.count}
                      </CustomText>
                    </>
                  ) : (
                    <CustomText variant="h8" fontFamily={Fonts.Medium}>
                      ₹{parseFloat(item.item.price) * item.count}
                    </CustomText>
                  )}
                </View>

                <CustomText
                  variant="h8"
                  fontFamily={Fonts.Medium}
                  style={{ marginTop: 4, opacity: 0.8 }}
                >
                  {item.count}x
                </CustomText>
              </View>
            </View>
          );
        })}

        
<BillDetails
  totalMRP={bill?.totalMRP ?? 0}
  subtotal={bill?.subtotal ?? 0}
  productDiscount={bill?.productDiscount ?? 0}
  offerDiscount={bill?.offerDiscount ?? 0}
  deliveryCharge={bill?.deliveryCharge ?? 0}
  grandTotal={bill?.grandTotal ?? order?.finalAmount ?? 0}
  appliedOffer={bill?.appliedOffer}

/>
      </View>
      <OrderDetails order={order} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    marginVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  headerIconBox: {
    height: 45,
    width: 45,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },

  imgContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    width: "18%",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  img: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  priceRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },

  striked: {
    textDecorationLine: "line-through",
    color: "#a1a1a1",
  },
});

export default OrderSummary;
