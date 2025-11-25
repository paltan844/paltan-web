import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigate, useLocation } from "react-router-dom";
import CustomHeader from "@components/ui/CustomHeader";
import { useAuthStore } from "@state/authStore";
import { useLocationStore } from "@state/locationStore";
import { getAddresses, mmkvStorage, saveAddresses } from "@state/storage";

// Floating Label Component (Web Safe)
const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  keyboardType = "default",
}) => {
  const [focused, setFocused] = useState(false);
  const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: focused || value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  return (
    <View style={{ marginBottom: 20 }}>
      <Animated.Text
        style={{
          position: "absolute",
          left: 0,
          top: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [18, -2],
          }),
          fontSize: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
          }),
          color: "#888",
        }}
      >
        {label}
      </Animated.Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={keyboardType}
        style={[styles.input, { paddingTop: 18 }]}
      />
    </View>
  );
};

const AddressDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

const { prefillAddress, allowedPincodes = [], source } = (location.state || {}) as any;


  const { user } = useAuthStore();

  const [pinCode, setPinCode] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [towerNo, setTowerNo] = useState("");
  const [buildingName, setBuildingName] = useState("");

  const [fullAddress, setFullAddress] = useState("");
  const [landmark, setLandmark] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverMobile, setReceiverMobile] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedType, setSelectedType] = useState("Home");

  const isPrefilled = !!prefillAddress;
  const isAddressMissing = !fullAddress?.trim();

 useEffect(() => {
  if (prefillAddress) {
    setFullAddress(prefillAddress.fullAddress || "");
    setCity(prefillAddress.city || "");
    setStateName(prefillAddress.state || "");
    setPinCode(prefillAddress.pincode || "");
    setLatitude(prefillAddress.latitude || "");
    setLongitude(prefillAddress.longitude || "");
  }
}, [prefillAddress]);


  useEffect(() => {
    if (user) {
      setReceiverName(user.name);
      setReceiverMobile(user.phone?.toString());
    }
  }, [user]);

  const handleSave = () => {
    if (!pinCode || !city || !stateName || !fullAddress || !receiverName || !receiverMobile) {
      alert("Please fill all required fields!");
      return;
    }

    const compiled = `${fullAddress}, ${city}, ${stateName} - ${pinCode}`;

    const detail = {
      houseNo,
      floorNo,
      towerNo,
      buildingName,
      fullAddress,
      landmark,
      city,
      state: stateName,
      pincode: pinCode,
      receiverName,
      receiverMobile,
      latitude,
      longitude,
      selectedType,
    };

    useLocationStore.getState().setSelectedLocation(compiled);
  useLocationStore.getState().setSelectedLocationObject(detail);

  // ⭐ 2. SAVE IN LOCAL STORAGE (VERY IMPORTANT)
  const saved = getAddresses();
  if (!saved.includes(compiled)) {
    const updated = [...saved, compiled];
    saveAddresses(updated);
  }

  // ⭐ 3. SAVE ADDRESS DETAILS
  mmkvStorage.setItem(`addressDetail_${compiled}`, JSON.stringify(detail));

  // ⭐ 4. NAVIGATE BACK
  if (source === "productorder") {
    navigate(-1);
  } else {
    navigate("/");
  }
};

  return (
    <View style={styles.container}>
      <CustomHeader title="Add Address" />

      <ScrollView style={styles.scroll}>

        {/* PIN + CITY + STATE */}
        <FloatingLabelInput label="Pin Code*" value={pinCode} onChangeText={setPinCode} editable={false} />
        <View style={styles.row}>
          <View style={styles.half}>
            <FloatingLabelInput label="City*" value={city} onChangeText={setCity} editable={false} />
          </View>
          <View style={styles.half}>
            <FloatingLabelInput label="State*" value={stateName} onChangeText={setStateName} editable={false} />
          </View>
        </View>

        {/* HOUSE NO + FLOOR */}
        <View style={styles.row}>
          <TextInput placeholder="House No." value={houseNo} onChangeText={setHouseNo} style={[styles.input, styles.half]} />
          <TextInput placeholder="Floor No." value={floorNo} onChangeText={setFloorNo} style={[styles.input, styles.half]} />
        </View>

        {/* BUILDING */}
        <TextInput placeholder="Building / Apartment Name" value={buildingName} onChangeText={setBuildingName} style={styles.input} />

        {/* LANDMARK */}
        <FloatingLabelInput label="Landmark" value={landmark} onChangeText={setLandmark} multiline numberOfLines={2} />

        {/* CHANGE/ADD LOCATION BUTTON */}
        {isAddressMissing ? (
          <TouchableOpacity
            style={styles.addLocationButton}
            onPress={() =>
              navigate("/currentlocation", {
                state: { allowedPincodes, source },
              })
            }
          >
            <Text style={styles.addLocationText}>📍 Add Address*</Text>
          </TouchableOpacity>
        ) : (
          <>
            <FloatingLabelInput
              label="Address*"
              value={fullAddress}
              onChangeText={setFullAddress}
              editable={!isPrefilled}
              multiline
              numberOfLines={4}
            />

            {isPrefilled && (
              <TouchableOpacity
                style={styles.addLocationButton}
                onPress={() =>
                  navigate("/currentlocation", {
                    state: { allowedPincodes, source },
                  })
                }
              >
                <Text style={styles.addLocationText}>📍 Change Address*</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* CONTACT DETAILS */}
        <Text style={styles.sectionTitle}>Delivery Contact Details</Text>
        <FloatingLabelInput label="Receiver Name*" value={receiverName} onChangeText={setReceiverName} />
        <FloatingLabelInput
          label="Receiver Mobile*"
          value={receiverMobile}
          onChangeText={setReceiverMobile}
          keyboardType="number-pad"
        />

        <Text style={styles.sectionTitle}>Save As</Text>
        <View style={styles.saveAsRow}>
          {["Home", "Work", "Other"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setSelectedType(t)}
              style={[
                styles.saveTypeBtn,
                selectedType === t && styles.saveTypeBtnActive,
              ]}
            >
              <Text style={[
                styles.saveTypeText,
                selectedType === t && styles.saveTypeTextActive,
              ]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* SAVE BUTTON */}
      <View style={styles.bottomBtn}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save & Proceed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// -------------------------------------------------------
// STYLES
// -------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16 },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    paddingVertical: 8,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: { width: "48%" },

  addLocationButton: {
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addLocationText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0a7c3a",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },

  saveAsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 40,
  },
  saveTypeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  saveTypeBtnActive: {
    backgroundColor: "#0078AA",
  },
  saveTypeText: { color: "#333" },
  saveTypeTextActive: { color: "#fff", fontWeight: "700" },

  bottomBtn: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  saveBtn: {
    backgroundColor: "#0078AA",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default AddressDetail;
