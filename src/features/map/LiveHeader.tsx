import { View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import React, { FC } from "react";
import { ChevronLeft } from "lucide-react"; // <-- Web-friendly icon
import { navigate } from "@utils/NavigationUtils";
import { useAuthStore } from "@state/authStore";
import CustomText from "@components/ui/CustomText";
import { Fonts } from "@utils/Constants";

const LiveHeader: FC<{
  title: string;
  type: "customer" | "Delivery";
  secondTitle: string;
}> = ({ title, type, secondTitle }) => {
  const isCustomer = type === "customer";
  const { currentOrder, setCurrentOrder } = useAuthStore();

  const handleBack = () => {
    if (isCustomer) {
      navigate("MainTabs");
      if (currentOrder?.status === "delivered") {
        setCurrentOrder(null);
      }
      return;
    }

    // navigate("DeliveryDashboard");
  };

  return (
    <SafeAreaView>
      <View
        style={[
          styles.headerContainer,
          isCustomer ? styles.customerHeader : styles.deliveryHeader,
        ]}
      >
        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={handleBack}>
          <ChevronLeft
            size={22}
            strokeWidth={2.2}
            color={isCustomer ? "#fff" : "#000"}
          />
        </Pressable>

        {/* Main Heading */}
        <CustomText
          variant="h8"
          fontFamily={Fonts.Medium}
          style={isCustomer ? styles.titleWhite : styles.titleBlack}
        >
          {title}
        </CustomText>

        {/* Sub Heading */}
        <CustomText
          variant="h4"
          fontFamily={Fonts.SemiBold}
          style={[isCustomer ? styles.titleWhite : styles.titleBlack, { marginTop: -2 }]}
        >
          {secondTitle}
        </CustomText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0,
    gap: 2,
  },

  customerHeader: {
    backgroundColor: "#00B761", // Fresh green gradient-like header
  },

  deliveryHeader: {
    backgroundColor: "#fff",
  },

  backButton: {
    position: "absolute",
    left: 20,
    top: 12,
    padding: 4,
  },

  titleBlack: {
    color: "#000",
  },

  titleWhite: {
    color: "#fff",
  },
});

export default LiveHeader;
