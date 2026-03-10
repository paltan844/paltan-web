/*
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
      
        <Pressable onPress={() => goBack()}>
          <Ionicons.IoChevronBack
            color={Colors.whitetext}
            size={RFValue(16)}
          />
        </Pressable>

      
        <CustomText
          style={styles.text}
          variant="h5"
        >
          {title}
        </CustomText>

        
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

  },
  text: {
    textAlign: "center",
    color: "rgba(251, 249, 248, 0.94)",
 fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",// ✅ use custom font
  fontWeight: "700",  
  },
});

export default CustomHeader;
*/



import React, { FC, useEffect, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Ionicons from "react-icons/io5";
import { goBack, navigate } from "@utils/NavigationUtils";
import CustomText from "./CustomText";
import { Colors } from "@utils/Constants";
import CustomStatusBar from "@utils/CustomStatusBar";

interface CustomHeaderProps {
  title: string;
  search?: boolean;
}

const CustomHeader: FC<CustomHeaderProps> = ({ title, search }) => {
   const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      const width = Dimensions.get("window").width;
      setIsDesktop(width >= 1024); 
    };

    checkSize();
    const sub = Dimensions.addEventListener("change", checkSize);
    return () => sub?.remove();
  }, []);

  const headerHeight = isDesktop ? 50 : 60;
  const iconSize = isDesktop ? 17 : 16;
  const titleFontSize = isDesktop ? 17 : 16;

  return (
    <>
      <CustomStatusBar />

      <View style={[styles.flexRow, { height: headerHeight }]}>
        {/* Back */}
        <Pressable onPress={() => goBack()}>
          <Ionicons.IoChevronBack
            color={Colors.whitetext}
            size={iconSize}
          />
        </Pressable>

        {/* Title */}
        <CustomText
          style={[styles.text, { fontSize: titleFontSize }]}
        >
          {title}
        </CustomText>

               <View>
          {search ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigate("SearchScreen", { startSearch: true })
              }
            >
              <Ionicons.IoSearch
                color={Colors.whitetext}
                size={iconSize}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: iconSize }} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  flexRow: {
   // height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(14, 76, 129, 0.94)",
    flexDirection: "row",
    borderBottomWidth: 0.6,
    borderColor: Colors.border,

  },
  text: {
    textAlign: "center",
    color: "rgba(251, 249, 248, 0.94)",
 fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",// ✅ use custom font
  fontWeight: "700",  
  },
});

export default CustomHeader;
