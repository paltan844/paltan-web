import React, { FC } from "react";
import {
  View,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Ionicons from "react-icons/io5"; // ✅ Web Ionicons
import { RFValue } from "react-native-responsive-fontsize";
import { goBack, navigate } from "@utils/NavigationUtils";
import CustomText from "./CustomText";
import { Colors, Fonts } from "@utils/Constants";
import CustomStatusBar from "@utils/CustomStatusBar";

interface CustomHeaderProps {
  title: string;
  search?: boolean;
}

const CustomHeader: FC<CustomHeaderProps> = ({ title, search }) => {
  return (
    <>
      <CustomStatusBar />
      <View style={styles.flexRow}>
        {/* Back Button */}
        <Pressable onPress={() => goBack()}>
          <Ionicons.IoChevronBack
            color={Colors.whitetext}
            size={RFValue(16)}
          />
        </Pressable>

        {/* Title */}
        <CustomText
          style={styles.text}
          variant="h5"
        >
          {title}
        </CustomText>

        {/* Search Icon (if enabled) */}
        <View>
          {search ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigate("SearchScreen", { startSearch: true })}
            >
              <Ionicons.IoSearch
                color={Colors.whitetext}
                size={RFValue(16)}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: RFValue(16) }} /> // placeholder to maintain alignment
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(14, 76, 129, 0.94)",
    flexDirection: "row",
    borderBottomWidth: 0.6,
    borderColor: Colors.border,
    zIndex: 1,
  },
  text: {
    textAlign: "center",
    color: "rgba(251, 249, 248, 0.94)",
 fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",// ✅ use custom font
  fontWeight: "700",  
  },
});

export default CustomHeader;
