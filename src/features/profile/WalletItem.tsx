import React, { FC, ReactNode } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Ionicons from "react-icons/io5"; // ✅ Ionicons for web
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";

interface WalletItemProps {
  icon: ReactNode; // ✅ Accepts JSX icons like <Ionicons.IoHeartOutline />
  label: string;
  color?: string;
  onPress?: () => void;
}

const WalletItem: FC<WalletItemProps> = ({ icon, label, color = Colors.text, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.walletItemContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{icon}</View>

      <CustomText variant="h8" fontFamily={Fonts.Medium} style={{ color, marginTop: 5 }}>
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  walletItemContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(238, 244, 244)",
    width: 80,
    height: 55,
    borderRadius: 10,
  },
});

export default WalletItem;
