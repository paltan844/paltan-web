import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as Ionicons from "react-icons/io5"; // ✅ Ionicons for web
import { Colors } from "@utils/Constants";
import WalletItem from "./WalletItem";
import { navigate } from "@utils/NavigationUtils";
import { mmkvStorage } from "@state/storage";

interface WalletSectionProps {
  user: any;
}

const WalletSection: FC<WalletSectionProps> = ({ user }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const savedLiked = mmkvStorage.getItem("likedState");
    if (savedLiked !== null) {
      setLiked(savedLiked === "true");
    }
  }, []);

  const toggleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    mmkvStorage.setItem("likedState", newLikedState.toString());
  };

  return (
    <View style={styles.walletContainer}>
      <WalletItem
        icon={
          liked ? (
            <Ionicons.IoHeart size={20} color="rgba(226, 23, 23, 0.5)" />
          ) : (
            <Ionicons.IoHeartOutline size={20} color={Colors.color} />
          )
        }
        label={liked ? "Liked" : "Like App"}
        color={liked ? "rgba(226, 23, 23, 0.5)" : Colors.color}
        onPress={toggleLike}
      />

      <WalletItem
        icon={<Ionicons.IoChatbubbleEllipsesOutline size={20} color={Colors.color} />}
        label="Support"
        color={Colors.color}
        onPress={() => {
          if (user) {
            navigate("/customersupport");
          } else {
           window.alert("Please login first to access Customer Support.");
          }
        }}
      />

      <WalletItem
        icon={<Ionicons.IoShareOutline size={20} color={Colors.color} />}
        label="Share"
        color={Colors.color}
        onPress={() => navigate("/share")}
      />

 <WalletItem
        icon={<Ionicons.IoReceiptOutline size={20} color={Colors.color} />}
        label="Kart"
        color={Colors.color}
        onPress={() => {
          if (user) {
            navigate("/kart");
          } else {
            window.alert("Please login first to access your Kart.");
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  walletContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    backgroundColor: "rgba(252, 249, 249, 0.5)",
    paddingVertical: 15,
    borderRadius: 15,
  },
});

export default WalletSection;
