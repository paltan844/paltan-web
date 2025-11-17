import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const ProductLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#79B530" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductLoader;
