import React from "react";
import { Platform } from "react-native";
import RNIcon from "react-native-vector-icons/Ionicons";

let WebIcon: Record<string, any> = {};

if (Platform.OS === "web") {
  const {
    IoHome,
    IoHomeOutline,
    IoCart,
    IoCartOutline,
    IoPerson,
    IoPersonOutline,
    IoGrid,
    IoGridOutline,
  } = require("react-icons/io5");

  WebIcon = {
    home: IoHome,
    "home-outline": IoHomeOutline,
    cart: IoCart,
    "cart-outline": IoCartOutline,
    person: IoPerson,
    "person-outline": IoPersonOutline,
    grid: IoGrid,
    "grid-outline": IoGridOutline,
  };
}

interface Props {
  name: string;  // IMPORTANT FIX
  size: number;
  color: string;
}

const IonIcon: React.FC<Props> = ({ name, size, color }) => {
  if (Platform.OS === "web") {
    const Component = WebIcon[name];
    return Component ? <Component size={size} color={color} /> : null;
  }

  return <RNIcon name={name} size={size} color={color} />;
};

export default IonIcon;
