import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { screenHeight, screenWidth } from "@utils/Scaling";
import { Colors, Fonts } from "@utils/Constants";
import CustomText from "@components/ui/CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { navigate } from "@utils/NavigationUtils";
import { useCartStore } from "@state/cartStore";
import CartOrderItem from "@features/order/CartOrderItem";
import EmptyProductListFooter from "@features/category/EmptyProductListFooter";

// ✅ Import Material Icons for Web
import {
  MdArrowDropUp,
  MdArrowDropDown,
  MdArrowForward,
  MdClose,
  MdArrowForwardIos,
} from "react-icons/md";

interface CartSummaryProps {
  cartCount: number;
  cartImage: string;
}

const CartSummary: FC<CartSummaryProps> = ({ cartCount, cartImage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const cartItems = useCartStore((state) => state.cart);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.flexRowGap}>
          <Image
            source={
              cartImage === null
                ? require("@assets/icons/bucket.png")
                : { uri: cartImage }
            }
            style={styles.image}
          />

          <CustomText fontFamily={Fonts.SemiBold}>
            {cartCount} ITEM{cartCount > 1 ? "S" : ""}
          </CustomText>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => setModalVisible(!modalVisible)}
          >
            {modalVisible ? (
              <MdArrowDropUp size={RFValue(23)} color="#000" />
            ) : (
              <MdArrowDropDown size={RFValue(23)} color="#000" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.7}
          onPress={() => navigate("/productorder")}
        >
          <CustomText style={styles.btnText} fontFamily={Fonts.Medium}>
            Next 
          </CustomText>
          <MdArrowForwardIos size={RFValue(10)} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ✅ Modal section */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.centeredCloseIcon}>
            <TouchableOpacity
              style={styles.crossButton}
              onPress={() => setModalVisible(false)}
            >
              <MdClose size={RFValue(18)} color="#000" />
            </TouchableOpacity>
          </View>

          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartOrderItem key={item._id} item={item} />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <EmptyProductListFooter />
                </View>
              )}
            </ScrollView>
          </Pressable>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    height: screenHeight * 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "rgba(220,220,220,0.6)",
    borderRadius: 20,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredCloseIcon: {
    alignItems: "center",
    marginBottom: -5,
    zIndex: 10,
  },
  crossButton: {
    backgroundColor: "rgba(202, 194, 212, 0.91)",
    padding: 3,
    borderRadius: 20,
  },
  flexRowGap: {
    flexDirection: "row",
    gap: screenWidth * 0.03,
    alignItems: "center",
  },
  container: {
    paddingBottom: 5,
    paddingTop: screenHeight * 0.014,
    paddingHorizontal: screenWidth * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
   borderTopWidth: 0.6,
  borderTopColor: "rgba(0,0,0,0.1)",
  
  },
  image: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.025,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  btn: {
    borderRadius: screenWidth * 0.025,
    paddingVertical: screenWidth * 0.015,
    backgroundColor: Colors.secondary,
    paddingHorizontal: screenWidth * 0.1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  btnText: {
    marginLeft: screenWidth * 0.02,
    color: "#fff",
    paddingBottom: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalContent: {
    maxHeight: screenHeight * 0.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 1,
    paddingTop: 10,
  },
});

export default CartSummary;
