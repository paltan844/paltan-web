/*import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  Platform,
  useWindowDimensions,
} from "react-native";
import { screenHeight, screenWidth } from "@utils/Scaling";
import { Colors, Fonts } from "@utils/Constants";
import CustomText from "@components/ui/CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { navigate } from "@utils/NavigationUtils";
import { useCartStore } from "@state/cartStore";
import { useAuthStore } from "@state/authStore";
import CartOrderItem from "@features/order/CartOrderItem";
import EmptyProductListFooter from "@features/category/EmptyProductListFooter";

import {
  MdArrowDropUp,
  MdArrowDropDown,
  MdClose,
  MdArrowForwardIos,
} from "react-icons/md";



interface CartSummaryProps {
  cartCount: number;
  cartImage: string;
}

const CartSummary: FC<CartSummaryProps> = ({ cartCount, cartImage }) => {

  const [modalVisible, setModalVisible] = useState(false);

  const { width } = useWindowDimensions();
  const isTabletPlus = width > 900;

const iconSize = width > 900 ? RFValue(12) : RFValue(23);

  const activeStyles = isTabletPlus ? desktopStyles : styles;

  const cartItems = useCartStore((state) => state.cart);
  const { user } = useAuthStore();

  const handleContinue = () => {
    if (!user || !user._id) {

      if (Platform.OS === "web") {
        const confirmed = window.confirm(
          "Please login to continue with your order."
        );

        if (confirmed) {
          navigate("/login");
        }
        return;
      }

      Alert.alert(
        "Login Required",
        "Please login to continue with your order.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigate("/login") },
        ]
      );
      return;
    }

    navigate("/productorder");
  };

  return (
    <>
      <View style={activeStyles.container}>

        <View style={activeStyles.flexRowGap}>

          <Image
            source={
              cartImage
                ? { uri: cartImage }
                : require("@assets/icons/bucket.png")
            }
            style={activeStyles.image}
          />

        <CustomText
  fontFamily={Fonts.SemiBold}
  fontSize={12}
  disableScaling
>
  {cartCount} ITEM{cartCount > 1 ? "S" : ""}
</CustomText>
          <TouchableOpacity
  style={activeStyles.iconButton}
  activeOpacity={0.7}
  onPress={() => setModalVisible(true)}
>
  {modalVisible ? (
    <MdArrowDropUp size={iconSize} color="#000" />
  ) : (
    <MdArrowDropDown size={iconSize} color="#000" />
  )}
</TouchableOpacity>

        </View>

       <TouchableOpacity
  style={activeStyles.btn}
  activeOpacity={0.8}
  onPress={handleContinue}
>
  <CustomText
    style={activeStyles.btnText}
    fontFamily={Fonts.Medium}
    fontSize={12}
    disableScaling
  >
    Next
  </CustomText>

<MdArrowForwardIos
  size={width > 900 ? RFValue(5) : RFValue(12)}
  color="#fff"
/>

</TouchableOpacity>

      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >

        <TouchableOpacity
          style={activeStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >

          <View style={activeStyles.centeredCloseIcon}>
            <TouchableOpacity
              style={activeStyles.crossButton}
              onPress={() => setModalVisible(false)}
            >
              <MdClose size={RFValue(18)} color="#000" />
            </TouchableOpacity>
          </View>

          <Pressable
            style={activeStyles.modalContent}
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
                <View style={activeStyles.emptyContainer}>
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

export default CartSummary;


const styles = StyleSheet.create({

  container: {
    paddingTop: screenHeight * 0.014,
    paddingBottom: 6,
    paddingHorizontal: screenWidth * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.6,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },

  flexRowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: screenWidth * 0.03,
  },

  image: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.025,
    borderColor: Colors.border,
    borderWidth: 1,
  },

  iconButton: {
    backgroundColor: "rgba(220,220,220,0.6)",
    borderRadius: 20,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  btn: {
    borderRadius: screenWidth * 0.025,
    paddingVertical: screenWidth * 0.015,
    paddingHorizontal: screenWidth * 0.1,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  btnText: {
    color: "#fff",
    paddingBottom: 2,
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
    paddingTop: 10,
  },

  centeredCloseIcon: {
    alignItems: "center",
    marginBottom: -6,
    zIndex: 10,
  },

  crossButton: {
    backgroundColor: "rgba(202, 194, 212, 0.91)",
    padding: 4,
    borderRadius: 20,
  },

  emptyContainer: {
    height: screenHeight * 0.4,
    justifyContent: "center",
    alignItems: "center",
  },

});

const desktopStyles = StyleSheet.create({

  container: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.6,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },

  flexRowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  image: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
  },

  iconButton: {
    backgroundColor: "rgba(220,220,220,0.6)",
    borderRadius: 20,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  btn: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 20,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  btnText: {
    color: "#fff",
    paddingBottom: 2,
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
    paddingTop: 10,
  },

  centeredCloseIcon: {
    alignItems: "center",
    marginBottom: -6,
    zIndex: 10,
  },

  crossButton: {
    backgroundColor: "rgba(202, 194, 212, 0.91)",
    padding: 4,
    borderRadius: 20,
  },

  emptyContainer: {
    height: screenHeight * 0.4,
    justifyContent: "center",
    alignItems: "center",
  },

});

*/


import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  Platform,
  useWindowDimensions,
} from "react-native";
import { screenHeight, screenWidth } from "@utils/Scaling";
import { Colors, Fonts } from "@utils/Constants";
import CustomText from "@components/ui/CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { navigate } from "@utils/NavigationUtils";
import { useCartStore } from "@state/cartStore";
import { useAuthStore } from "@state/authStore";
import CartOrderItem from "@features/order/CartOrderItem";
import EmptyProductListFooter from "@features/category/EmptyProductListFooter";

import {
  MdArrowDropUp,
  MdArrowDropDown,
  MdClose,
  MdArrowForwardIos,
} from "react-icons/md";

interface CartSummaryProps {
  cartCount: number;
  cartImage: string;
}

const CartSummary: FC<CartSummaryProps> = ({ cartCount, cartImage }) => {

  const [modalVisible, setModalVisible] = useState(false);

  const { width } = useWindowDimensions();
  const isDesktop = width > 900;

  const activeStyles = isDesktop ? desktopStyles : styles;

  const iconSize = isDesktop ? RFValue(12) : RFValue(23);
  const closeIconSize = isDesktop ? RFValue(11) : RFValue(18);

  const cartItems = useCartStore((state) => state.cart);
  const { user } = useAuthStore();

  const handleContinue = () => {

    if (!user || !user._id) {

      if (Platform.OS === "web") {

        const confirmed = window.confirm(
          "Please login to continue with your order."
        );

        if (confirmed) navigate("/login");

        return;
      }

      Alert.alert(
        "Login Required",
        "Please login to continue with your order.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigate("/login") },
        ]
      );

      return;
    }

    navigate("/productorder");
  };

  return (
    <>
      <View style={activeStyles.container}>

        <View style={activeStyles.flexRowGap}>

          <Image
            source={
              cartImage
                ? { uri: cartImage }
                : require("@assets/icons/bucket.png")
            }
            style={activeStyles.image}
          />

          <CustomText
            fontFamily={Fonts.SemiBold}
            fontSize={12}
            disableScaling
          >
            {cartCount} ITEM{cartCount > 1 ? "S" : ""}
          </CustomText>

          <TouchableOpacity
            style={activeStyles.iconButton}
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}
          >
            {modalVisible ? (
              <MdArrowDropUp size={iconSize} color="#000" />
            ) : (
              <MdArrowDropDown size={iconSize} color="#000" />
            )}
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={activeStyles.btn}
          activeOpacity={0.8}
          onPress={handleContinue}
        >
          <CustomText
            style={activeStyles.btnText}
            fontFamily={Fonts.Medium}
            fontSize={12}
            disableScaling
          >
            Next
          </CustomText>

          <MdArrowForwardIos
            size={isDesktop ? RFValue(5) : RFValue(12)}
            color="#fff"
          />
        </TouchableOpacity>

      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >

        <TouchableOpacity
          style={activeStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >

         <View style={activeStyles.centeredCloseIcon}>
  <TouchableOpacity
    style={activeStyles.crossButton}
    onPress={() => setModalVisible(false)}
  >
    <MdClose size={closeIconSize} color="#000" />
  </TouchableOpacity>
</View>

          <Pressable
            style={activeStyles.modalContent}
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

                <View style={activeStyles.emptyContainer}>
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

export default CartSummary;

const styles = StyleSheet.create({

  container: {
    paddingTop: screenHeight * 0.014,
    paddingBottom: 6,
    paddingHorizontal: screenWidth * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.6,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },

  flexRowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: screenWidth * 0.03,
  },

  image: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.025,
    borderColor: Colors.border,
    borderWidth: 1,
  },

  iconButton: {
    backgroundColor: "rgba(220,220,220,0.6)",
    borderRadius: 20,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  btn: {
    borderRadius: screenWidth * 0.025,
    paddingVertical: screenWidth * 0.015,
    paddingHorizontal: screenWidth * 0.1,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  btnText: {
    color: "#fff",
    paddingBottom: 2,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  modalContent: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    maxHeight: screenHeight * 0.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },

  centeredCloseIcon: {
    alignItems: "center",
    marginBottom: -6,
    zIndex: 10,
  },

  crossButton: {
    backgroundColor: "rgba(202, 194, 212, 0.91)",
    padding: 4,
    borderRadius: 20,
  },

  emptyContainer: {
    height: screenHeight * 0.4,
    justifyContent: "center",
    alignItems: "center",
  },

});

const desktopStyles = StyleSheet.create({

  container: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.6,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },

  flexRowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  image: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
  },

  iconButton: {
    backgroundColor: "rgba(220,220,220,0.6)",
    borderRadius: 20,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  btn: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 20,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  btnText: {
    color: "#fff",
    paddingBottom: 2,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  modalContent: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    maxHeight: screenHeight * 0.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },

  centeredCloseIcon: {
    alignItems: "center",
    marginBottom: -6,
    zIndex: 10,
  },

  crossButton: {
    backgroundColor: "rgba(202, 194, 212, 0.91)",
    padding: 4,
    borderRadius: 20,
  },

  emptyContainer: {
    height: screenHeight * 0.4,
    justifyContent: "center",
    alignItems: "center",
  },

});