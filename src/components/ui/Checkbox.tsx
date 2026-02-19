import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Colors } from "@utils/Constants";

interface Props {
  checked: boolean;
  onPress: () => void;
}

const SimpleCheckbox: React.FC<Props> = ({ checked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.box}>
      {checked && <View style={styles.inner} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});

export default SimpleCheckbox;
