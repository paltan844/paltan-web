import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";

import * as Ionicons from "react-icons/io5";

import { goBack, navigate } from "@utils/NavigationUtils";
import { useLocation } from "react-router-dom";
import { getAddresses, mmkvStorage, saveAddresses } from "@state/storage";

import DeliveryAreaModal from "./DeliveryAreaModal";
import ManualPincodeModal from "./ManualPincodeModal";
import AddressSummaryModal from "./AddressSummaryModal";

import { useLocationStore, useLocationStorePincode } from "@state/locationStore";
import { useAuthStore } from "@state/authStore";

import { FlashList } from "@shopify/flash-list";
import { capitalizeWords, formatSelectedLocation } from "@utils/AddressPreview";
import CustomHeader from "@components/ui/CustomHeader";

const { height, width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";


type Pincode = {
  code: string;
};

type District = {
  name: string;
  pincodes: Pincode[];
};

type StateData = {
  name: string;
  districts: District[];
};

type CombinedRouteParams = {
  onAddressAdded?: (address: string, addressDetail: any) => void;
  onAddressEdit?: (address: string, addressDetail: any) => void;
  existingAddress?: string;
  source?: 'productorder' | 'livetracking' | string;
};



const LocationSelector = () => {
  const { search } = isWeb ? useLocation() : ({ search: "" } as any);
  const query = new URLSearchParams(search);
  const sourceFromQuery = query.get("source") || null;

  const source = isWeb ? sourceFromQuery : null;

  // -------------------------
  // FIXED VARIABLE NAMING
  // -------------------------

  // ⭐ User saved addresses
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);

  // ⭐ India States / Districts / Pincodes
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<Record<string, string[]>>({});
  const [pincodes, setPincodes] = useState<Record<string, string[]>>({});
  const [allowedPincodes, setAllowedPincodes] = useState<string[]>([]);

  const [selectedPincode, setSelectedPincode] = useState("211001");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [addressDetail, setAddressDetail] = useState<any>({});

  const [areaModalVisible, setAreaModalVisible] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const { selectedLocation, setSelectedLocation } = useLocationStore();
  const { fetchLocationData, locationData } = useLocationStorePincode();
  const { user } = useAuthStore();


  useEffect(() => {
    fetchLocationData();
  }, []);
useEffect(() => {
  console.log("🌍 locationData Loaded →", locationData);

  if (locationData?.length > 0) {
    const stateNames = locationData.map((s: any) => s.name);
    const districtMap: Record<string, string[]> = {};
    const pincodeMap: Record<string, string[]> = {};

    locationData.forEach((state: any) => {
      districtMap[state.name] = state.districts.map((d: any) => d.name);

      state.districts.forEach((d: any) => {
        pincodeMap[d.name] = d.pincodes.map((p: any) => p.code);
      });
    });

    console.log("📌 States →", stateNames);
    console.log("🏙 Districts →", districtMap);
    console.log("🏷 Pincodes →", pincodeMap);

    setAvailableStates(stateNames);
    setDistricts(districtMap);
    setPincodes(pincodeMap);

    const allPincodes = Object.values(pincodeMap)
      .flat()
      .map((x: any) => String(x));   // ⭐ FIXED HERE

    console.log("📮 Allowed Pincodes →", allPincodes);

    setAllowedPincodes(allPincodes);
  }
}, [locationData]);


  useEffect(() => {
    if (!user) {
      setSelectedLocation("");
      return;
    }

    const saved = getAddresses();
    const savedSelected = mmkvStorage.getItem("selectedLocation");

    if (savedSelected && saved.includes(savedSelected)) {
      setSelectedLocation(savedSelected);
    } else if (saved.length > 0) {
      setSelectedLocation(saved[0]);
      mmkvStorage.setItem("selectedLocation", saved[0]);
    } else {
      setSelectedLocation("");
    }

    setSavedAddresses(saved);
  }, [location]);

  
  const handleSaveAddress = (newAddress: string, detail: any) => {
    const saved = getAddresses();

    if (!saved.includes(newAddress)) {
      const updated = [...saved, newAddress];
      saveAddresses(updated);
      setSavedAddresses(updated); 
    }

    setSelectedLocation(newAddress);
    mmkvStorage.setItem("selectedLocation", newAddress);
    mmkvStorage.setItem(`addressDetail_${newAddress}`, JSON.stringify(detail));

    if (detail?.pincode) setSelectedPincode(detail.pincode);
  };

  const handleHomePress = () => {
    const saved = mmkvStorage.getItem(`addressDetail_${selectedLocation}`);
    setAddressDetail(saved ? JSON.parse(saved) : { address: selectedLocation });
    setSelectedAddress(selectedLocation);
    setSummaryVisible(true);
  };

  const handleSelect = (loc: string) => {
    setSelectedLocation(loc);
    mmkvStorage.setItem("selectedLocation", loc);

    const saved = mmkvStorage.getItem(`addressDetail_${loc}`);
    if (saved) {
      const detail = JSON.parse(saved);
      if (detail?.pincode) setSelectedPincode(detail.pincode);
      useLocationStore.getState().setSelectedLocationObject(detail);
    }
  };

  const handleLongPress = (loc: string) => {
    const saved = mmkvStorage.getItem(`addressDetail_${loc}`);
    setAddressDetail(saved ? JSON.parse(saved) : { address: loc });
    setSelectedAddress(loc);
    setSummaryVisible(true);
  };

  const handleDelete = () => {
    if (!selectedAddress) return;

    mmkvStorage.removeItem(`addressDetail_${selectedAddress}`);

    setSavedAddresses((prev) => {
      const updated = prev.filter((i) => i !== selectedAddress);
      saveAddresses(updated);

      if (selectedLocation === selectedAddress) {
        const fallback = updated[0] || "";
        setSelectedLocation(fallback);
        mmkvStorage.setItem("selectedLocation", fallback);
      }

      return updated;
    });

    setSelectedAddress(null);
    setSummaryVisible(false);
  };

const openCurrentLocation = () => {
  console.log("📤 LocationSelector -> navigating to CurrentLocation");
  console.log("📤 allowedPincodes (sending) ->", allowedPincodes);
  console.log("📤 source ->", source);

  // -------------------------
  // ⭐ FIX: STORE IN LOCALSTORAGE (Guaranteed, No Loss)
  // -------------------------
  try {
    localStorage.setItem(
      "CURRENT_LOCATION_META",
      JSON.stringify({
        allowedPincodes,
        source,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.warn("⚠️ localStorage error:", e);
  }

  // -------------------------
  // ⭐ NAVIGATE USING URL PARAMS (Refresh-safe)
  // -------------------------
  const pinsString = allowedPincodes.join(",");
  const src = source || "";

  navigate(`/currentlocation?pins=${pinsString}&source=${src}`);
};



  const Header = (
    <View>
      <CustomHeader title="Location" />
    </View>
  );


  const Body = (
    <>
      <Text style={isWeb ? web.info : styles.infoText}>
        Select a pincode or location to check availability
      </Text>

      <TouchableOpacity style={styles.locationRow} onPress={openCurrentLocation}>
        <Ionicons.IoLocateOutline size={20} color="#00BA3C" />
        <Text style={styles.homeLabel}>Use Current Location</Text>
        <Ionicons.IoChevronForwardOutline size={20} style={{ marginLeft: "auto" }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.locationRow} onPress={handleHomePress}>
        <Ionicons.IoHomeOutline size={22} color="#00BA3C" />
        <Text style={styles.homeLabel}>Home - </Text>
      <Text
  numberOfLines={1}
  ellipsizeMode="tail"
  style={styles.locationText}
>
  {selectedLocation
    ? capitalizeWords(formatSelectedLocation(selectedLocation))
    : "Select your address"}
</Text>


        <Ionicons.IoChevronForwardOutline size={20} style={{ marginLeft: "auto" }} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.locationRow}
        onPress={() => setManualModalVisible(true)}
      >
        <Ionicons.IoLocationOutline size={22} color="#00BA3C" />
        <Text style={styles.homeLabel}>Enter Pincode - </Text>
        <Text style={styles.pincodeChip}>{selectedPincode}</Text>

        <Ionicons.IoChevronForwardOutline size={20} style={{ marginLeft: "auto" }} />
      </TouchableOpacity>

      {/* Delivery Available */}
      <TouchableOpacity
        style={styles.locationRow}
        onPress={() => setAreaModalVisible(true)}
      >
        <Ionicons.IoCarOutline size={22} color="#00BA3C" />
        <Text style={styles.homeLabel}>Delivery Available in</Text>

        <Ionicons.IoChevronForwardOutline size={20} style={{ marginLeft: "auto" }} />
      </TouchableOpacity>

      {/* ------------------- ADDRESS LIST FIXED ------------------- */}
      <View style={isWeb ? web.list : styles.list}>
        <FlashList
          data={[...savedAddresses, "ADD_NEW_ADDRESS"]} // ⭐ FIXED
          numColumns={2}
          estimatedItemSize={180}
          renderItem={({ item }) =>
            item === "ADD_NEW_ADDRESS" ? (
              <TouchableOpacity
                style={styles.addressCard}
                onPress={openCurrentLocation}
              >
                <View style={styles.centerContent}>
                  <View style={styles.addIcon}>
                    <Ionicons.IoAddOutline size={22} color="#fff" />
                  </View>
                  <Text style={styles.addText}>Add New Address</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.selectedItem,
                  item === selectedLocation && styles.highlighted,
                ]}
                onPress={() => handleSelect(item)}
                onLongPress={() => handleLongPress(item)}
              >
                <Text
                  style={[
                    styles.itemText,
                    item === selectedLocation && styles.highlightedText,
                  ]}
                >
                  {capitalizeWords(formatSelectedLocation(item))}
                </Text>
              </TouchableOpacity>
            )
          }
        />
      </View>
    </>
  );

  /* ---------------- Render Modes ---------------- */
  return isWeb ? (
    <SafeAreaView style={web.page}>
      {Header}
      <ScrollView>
        <View style={web.body}>{Body}</View>
      </ScrollView>

      {/* MODALS */}
      <DeliveryAreaModal
        visible={areaModalVisible}
        onClose={() => setAreaModalVisible(false)}
        STATES={availableStates} 
        DISTRICTS={districts}
        PINCODES={pincodes}
        onSelectPincode={setSelectedPincode}
      />

      <ManualPincodeModal
        visible={manualModalVisible}
        onClose={() => setManualModalVisible(false)}
        allowedPincodes={allowedPincodes}
onSubmit={(pin, ok) => {
  if (ok) {
    setSelectedPincode(pin);
    return;
  }

  if (Platform.OS === "web") {
    window.alert("Service not available in this pincode.");
  } else {
    Alert.alert("Service Unavailable", "Not deliverable.");
  }
}}

      />

      <AddressSummaryModal
        visible={summaryVisible}
        onClose={() => setSummaryVisible(false)}
        address={addressDetail}
        onDelete={handleDelete}
       onEdit={() => {
  setSummaryVisible(false);
  setTimeout(() => {
    navigate("/addressdetail", {
      state: {
        existingAddress: selectedAddress,
        prefillAddress: addressDetail,
        allowedPincodes,
        source,
      },
    });
  }, 200);
}}

      />
    </SafeAreaView>
  ) : (
    <View style={styles.backdrop}>
      <TouchableOpacity
        style={styles.backdropTouch}
        activeOpacity={1}
        onPress={() => goBack()}
      />

      <View style={styles.sheet}>
        {Header}
        {Body}
      </View>
    </View>
  );
};

export default LocationSelector;

/* ---------------- MOBILE STYLES ---------------- */
const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  backdropTouch: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: height * 0.58,
    padding: 14,
  },

  bottomSheet: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    alignItems: "center",
  },

  modalTitle: { fontSize: 17, fontWeight: "700", marginLeft: 8 },
  infoText: { fontSize: 13, color: "#777", marginVertical: 10 },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.7,
    borderColor: "#ddd",
    gap: 12,
  },

  homeLabel: {
    fontWeight: "700",
    fontSize: 14,
  },

  locationText: {
    flex: 1,
    fontSize: 13,
    marginLeft: 4,
  },

  pincodeChip: {
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: "700",
  },

  list: {
    height: height * 0.35,
    marginTop: 12,
  },

  addressCard: {
    height: 150,
    width: (width / 2) - 30,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  centerContent: { alignItems: "center" },

  addIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0da653",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  addText: { fontWeight: "700", color: "#0da653" },

  selectedItem: {
    height: 150,
    width: (width / 2) - 30,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    margin: 8,
    padding: 10,
    justifyContent: "center",
  },

  highlighted: {
    borderWidth: 1,
    borderColor: "#00BA3C",
    backgroundColor: "rgba(0,186,60,0.12)",
  },

  itemText: { fontSize: 13 },

  highlightedText: { fontWeight: "700" },
});

/* ---------------- WEB STYLES ---------------- */
const web = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff", minHeight: "100vh" },

  headerRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 6,
  },

  info: { fontSize: 15, marginVertical: 10, color: "#555" },

  body: {
    padding: 14,
    maxWidth: 1100,
    width: "100%",
    alignSelf: "center",
  },

  list: {

    minHeight: 220,
    marginTop: 12,
  },
});
