import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
  Animated,
  TextInput,
} from "react-native";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import { getActiveOffers, Offer } from "@service/productService";
import { RFValue } from "react-native-responsive-fontsize";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/* ---------------- Close Icon ---------------- */
let CloseIcon: any;
if (Platform.OS === "web") {
  const { MdClose } = require("react-icons/md");
  CloseIcon = MdClose;
} else {
  const MaterialCommunityIcons =
    require("react-native-vector-icons/MaterialCommunityIcons").default;
  CloseIcon = (props: any) => (
    <MaterialCommunityIcons {...props} name="close" />
  );
}

/* ---------------- Props ---------------- */
interface OfferModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (couponCode: string) => void;
  cartSubtotal: number;
    orderCount: number;  
}

/* ---------------- Colors ---------------- */
const TYPE_COLORS: Record<string, string> = {
  percent: "#0A8F49",
  flat: "#1E90FF",
  free_delivery: "#2ECC71",
  bogo: "#E91E63",
  bank: "#FF9800",
};

const OfferModal: React.FC<OfferModalProps> = ({
  visible,
  onClose,
  onSelect,
  cartSubtotal,
   orderCount,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();

      fetchOffers();
    } else {
      slideAnim.setValue(0);
    }
  }, [visible]);

  /* ---------------- Fetch Offers ---------------- */
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await getActiveOffers();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Offer fetch error:", err);
      setOffers([]);
    }
    setLoading(false);
  };

  const isOfferEligible = (offer: Offer) => {
  if (
    typeof offer.minOrderAmount === "number" &&
    cartSubtotal < offer.minOrderAmount
  ) {
    return false;
  }

  if (offer.isFirstOrderOnly && orderCount > 0) {
    return false;
  }

  return true;
};

  const handleManualApply = () => {
    if (!manualCode.trim()) return;
    onSelect(manualCode.trim().toUpperCase());
    onClose();
  };

  const renderItem = ({ item }: { item: Offer }) => {
    const eligible = isOfferEligible(item);
    const color = TYPE_COLORS[item.discountType] || Colors.secondary;

    const getOfferLabel = () => {
      switch (item.discountType) {
        case "bogo":
          return "Buy 1 Get 1 Free";
        case "free_delivery":
          return "Free Delivery";
        case "percent":
          return `${item.discountValue}% OFF`;
        case "flat":
          return `₹${item.discountValue} OFF`;
        case "bank":
          return "Bank Offer";
        default:
          return "";
      }
    };

    return (
      <View
        style={[
          styles.cardWrapper,
          !eligible && styles.disabledCard,
        ]}
      >
        <View
          style={[
            styles.leftBox,
            { backgroundColor: color + "22" },
          ]}
        >
          <CustomText fontFamily={Fonts.SemiBold} style={{ color }}>
            {getOfferLabel()}
          </CustomText>

          {item.title && (
            <CustomText style={styles.desc}>{item.title}</CustomText>
          )}

          {item.minOrderAmount && (
            <CustomText style={styles.minText}>
              Min order ₹{item.minOrderAmount}
            </CustomText>
          )}

          {!eligible && item.isFirstOrderOnly && orderCount > 0 && (
            <CustomText style={styles.notEligibleText}>
              Valid only on first order
            </CustomText>
          )}

          {!eligible &&
            cartSubtotal < (item.minOrderAmount || 0) && (
              <CustomText style={styles.notEligibleText}>
                Increase cart value to apply
              </CustomText>
            )}
        </View>

        <TouchableOpacity
          disabled={!eligible}
          style={[
            styles.rightBox,
            !eligible && styles.disabledApply,
          ]}
          onPress={() => {
            if (!eligible) return;
            onSelect(item.couponCode);
            onClose();
          }}
        >
          <CustomText style={styles.codeText}>
            {item.couponCode}
          </CustomText>

          <CustomText style={styles.applyText}>
            {eligible ? "Apply" : "Not eligible"}
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const slideTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.overlay} onPress={onClose} />

      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: slideTranslateY }] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <CustomText fontFamily={Fonts.Bold} style={styles.title}>
            Coupons
          </CustomText>
          <TouchableOpacity onPress={onClose}>
            <CloseIcon size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Manual input */}
        <View style={styles.inputRow}>
          <TextInput
            value={manualCode}
            onChangeText={setManualCode}
            placeholder="Enter Coupon Code"
            autoCapitalize="characters"
            style={styles.input}
          />

          <TouchableOpacity
            onPress={handleManualApply}
            style={styles.applyBtn}
          >
            <CustomText style={styles.applyBtnText}>
              Apply
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* List */}
        {loading ? (
          <CustomText style={{ textAlign: "center", marginTop: 20 }}>
            Loading coupons...
          </CustomText>
        ) : (
          <FlatList
            data={offers}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </Modal>
  );
};

export default OfferModal;

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: "#f3f4f0ff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: RFValue(16),
    color: "#a2ae61ff",
  },
  inputRow: {
    flexDirection: "row",
    marginVertical: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 36,
    fontFamily: Fonts.Medium,
  },
  applyBtn: {
    marginLeft: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF2D55",
    justifyContent: "center",
  },
  applyBtnText: {
    color: "#FF2D55",
    fontFamily: Fonts.SemiBold,
  },
  cardWrapper: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 2,
  },
  disabledCard: {
    opacity: 0.45,
  },
  leftBox: {
    flex: 1.2,
    padding: 14,
  },
  rightBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledApply: {
    backgroundColor: "#f5f5f5",
  },
  codeText: {
    fontFamily: Fonts.SemiBold,
    fontSize: RFValue(14),
  },
  applyText: {
    marginTop: 4,
    color: "#FF2D55",
    fontFamily: Fonts.SemiBold,
  },
  desc: {
    marginTop: 4,
    fontSize: RFValue(12),
    opacity: 0.8,
  },
  minText: {
    marginTop: 4,
    fontSize: RFValue(11),
    color: "#666",
  },
  notEligibleText: {
    marginTop: 6,
    fontSize: RFValue(11),
    color: "#999",
    fontFamily: Fonts.Medium,
  },
});
