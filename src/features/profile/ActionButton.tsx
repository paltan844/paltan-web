import React, { FC, ReactNode } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Ionicons from "react-icons/io5";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";

interface ActionButtonProps {
  icon: ReactNode; // ✅ Now accepts JSX icons (e.g., <Ionicons.IoClipboardOutline />)
  label: string;
  onPress?: () => void;
  color?: string;
}

const ActionButton: FC<ActionButtonProps> = ({
  icon,
  label,
  onPress,
  color = Colors.text,
}) => {
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{icon}</View>

      <CustomText
        variant="h7"
        fontFamily={Fonts.Medium}
        style={styles.label}
      >
        {label}
      </CustomText>

      <Ionicons.IoChevronForwardOutline
        size={16}
        color={Colors.text}
        style={styles.back}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    padding: 8,
    borderRadius: 100,
  },
  btn: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
  },
  label: {
    flex: 1,
  },
  back: {
    paddingRight: 15,
  },
});

export default ActionButton;
