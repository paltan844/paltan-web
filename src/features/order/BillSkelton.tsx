import React, { FC } from "react";
import { View, StyleSheet } from "react-native";

const BillSkeleton: FC = () => {
  return (
    <View style={styles.container}>
      {/* Rows */}
      <View style={styles.row} />
      <View style={styles.row} />
      <View style={styles.row} />
      <View style={styles.row} />

      {/* Total Row (Thoda bada) */}
      <View style={[styles.row, styles.totalRow]} />
    </View>
  );
};

export default BillSkeleton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  row: {
    height: 14,
    backgroundColor: "#EAEAEA",
    borderRadius: 6,
    marginBottom: 10,
  },
  totalRow: {
    height: 28,
    marginTop: 6,
  },
});
