import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import { getActiveOffers, Offer } from "@service/productService";
import { RFValue } from "react-native-responsive-fontsize";

// ✅ Conditional icon imports
let CloseIcon: any;
if (Platform.OS === "web") {
  const { MdClose } = require("react-icons/md");
  CloseIcon = MdClose;
} else {
  const MaterialCommunityIcons = require("react-native-vector-icons/MaterialCommunityIcons").default;
  CloseIcon = (props: any) => (
    <MaterialCommunityIcons {...props} name="close" />
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface OfferModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (offer: Offer) => void;
  selectedOfferId?: string;
}

const OfferModal: React.FC<OfferModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedOfferId,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) fetchOffers();
  }, [visible]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await getActiveOffers();
      if (data) setOffers(data);
    } catch (err) {
      console.error("❌ Offer fetch error:", err);
    }
    setLoading(false);
  };

  const renderItem = ({ item }: { item: Offer }) => {
    const isSelected = item._id === selectedOfferId;

    return (
      <TouchableOpacity
        style={[styles.offerCard, isSelected && styles.selectedOfferCard]}
        activeOpacity={0.8}
        onPress={() => onSelect(item)}
      >
        <CustomText
          fontFamily={Fonts.SemiBold}
          variant="h7"
          style={{
            color: isSelected
              ? Colors.backgroundSecondary
              : Colors.text,
          }}
        >
          {item.title}
        </CustomText>

        {item.description ? (
          <CustomText
            style={{
              opacity: 0.7,
              marginTop: 4,
              color: isSelected
                ? Colors.backgroundSecondary
                : Colors.text,
            }}
          >
            {item.description}
          </CustomText>
        ) : null}

        {/* Optional discount label */}
        <CustomText
          style={{
            marginTop: 6,
            color: isSelected ? "#fff" : Colors.secondary,
            fontWeight: "600",
            fontSize: RFValue(11),
          }}
        >
          {item.discountType === "percent"
            ? `${item.discountValue}% OFF`
            : `₹${item.discountValue} OFF`}
        </CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose} />

      <View style={styles.container}>
        <View style={styles.header}>
          <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
            Available Offers
          </CustomText>

          <TouchableOpacity onPress={onClose}>
            {Platform.OS === "web" ? (
              <CloseIcon size={22} color={Colors.text} />
            ) : (
              <CloseIcon size={24} color={Colors.text} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {loading ? (
          <CustomText style={{ textAlign: "center", marginTop: 20 }}>
            Loading Offers...
          </CustomText>
        ) : (
          <FlatList
            data={offers}
            keyExtractor={(item) => item._id || item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SCREEN_HEIGHT * 0.9,
    backgroundColor: Colors.backgroundSecondary,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  offerCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOfferCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});

export default OfferModal;
