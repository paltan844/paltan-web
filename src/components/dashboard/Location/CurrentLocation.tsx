/*
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Navigation, Search } from "lucide-react";
import axios from "axios";
import LocationSearchModal from "./LocationSearchModal";
import { GOOGLE_MAP_API } from "@service/config";
import CustomHeader from "@components/ui/CustomHeader";
import { useLocationStorePincode } from "@state/locationStore";

const MAP_HEIGHT = Dimensions.get("window").height * 0.897;

const loadGoogleMaps = () =>
  new Promise<void>((resolve, reject) => {
    if (window.google) {
      return resolve();
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => reject("Google Maps load failed");
    document.head.appendChild(script);
  });


const CurrentLocationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();


const { search, state } = location;
const query = new URLSearchParams(search);

// URL se try karo
let allowedPincodes: string[] = [];
let source: string | null = query.get("source") || null;
const pinsParam = query.get("pins");

// URL pins
if (pinsParam) {
  allowedPincodes = pinsParam.split(",").map((p) => p.trim());
}

// FALLBACK → navigation.state
if (allowedPincodes.length === 0 && state?.allowedPincodes) {
  allowedPincodes = state.allowedPincodes;
  if (!source) source = state.source || null;
}

// FINAL FALLBACK → localStorage
if (allowedPincodes.length === 0) {
  try {
    const cached = localStorage.getItem("CURRENT_LOCATION_META");
    if (cached) {
      const json = JSON.parse(cached);
      allowedPincodes = json.allowedPincodes || [];
      if (!source) source = json.source || null;
    }
  } catch {}
}


  const { locationData, fetchLocationData } = useLocationStorePincode();

  const mapRef = useRef<any>(null);

  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);

  const [address, setAddress] = useState("");
  const [geo, setGeo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [computedAllowedPincodes, setComputedAllowedPincodes] = useState<string[]>([]);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);



  useEffect(() => {
    if (!locationData || locationData.length === 0) {
      fetchLocationData();
    }
  }, []);

 
  useEffect(() => {

    if (!locationData || locationData.length === 0) {
      return;
    }

    const pincodeMap: Record<string, string[]> = {};

    locationData.forEach((s: any) => {
      s.districts?.forEach((d: any) => {
        pincodeMap[d.name] = d.pincodes?.map((p: any) => String(p.code)) || [];
      });
    });

    const allPins = Object.values(pincodeMap).flat();

    const merged = Array.from(new Set([...allPins, ...allowedPincodes]));
    setComputedAllowedPincodes(merged);
  }, [locationData]);


  /* ---------------- INIT MAP ---------------- /
  const initMap = () => {

    const map = new google.maps.Map(document.getElementById("map")!, {
      center: { lat, lng },
      zoom: 16,
      disableDefaultUI: true,
      gestureHandling: "greedy",      
      fullscreenControl: false,
    });

    mapRef.current = map;

    map.addListener("dragend", () => {
      const c = map.getCenter();

      if (!c) return;
      setLat(c.lat());
      setLng(c.lng());
      fetchAddress(c.lat(), c.lng());
    });
  };

  
useEffect(() => {

  loadGoogleMaps()
    .then(() => {
      initMap();
      setTimeout(() => useBrowserLocation(), 400);
    })
    .catch((err) => {
      alert("Failed to load Google Maps");
    });
}, []);


  /* ---------------- GEO + PINCODE CHECK ----------------/
  const fetchAddress = async (lt: number, ln: number) => {

    setLoading(true);

    try {
      const res = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        { params: { latlng: `${lt},${ln}`, key: GOOGLE_MAP_API } }
      );

      const result = res.data.results[0];

      if (!result) {
        return;
      }

      const parts = result.address_components;
      const get = (t: string) =>
        parts.find((c: any) => c.types.includes(t))?.long_name || "";

      const d = {
        formatted: result.formatted_address,
        pincode: get("postal_code"),
        city: get("locality") || get("administrative_area_level_2"),
        state: get("administrative_area_level_1"),
        latitude: lt,
        longitude: ln,
      };

      setAddress(d.formatted);
      setGeo(d);

      const pin = String(d.pincode);

      const finalPins = [
        ...computedAllowedPincodes.map(String),
        ...allowedPincodes.map(String)
      ];


      const available = finalPins.includes(pin);

      setDeliveryAvailable(available);
    } catch (e) {
      console.warn("❌ Geocode error:", e);
    }

    setLoading(false);
  };


  /* ---------------- SEARCH MODAL SELECT ---------------- 
  const handlePlaceSelect = (lt: number, ln: number, desc: string, g?: any) => {

    mapRef.current?.setCenter({ lat: lt, lng: ln });
    setLat(lt);
    setLng(ln);
    setAddress(desc);

     fetchAddress(lt, ln);

    if (g) {
      setGeo(g);

      const pin = String(g.pincode);
      const finalPins = [...computedAllowedPincodes, ...allowedPincodes];

      setDeliveryAvailable(finalPins.includes(pin));
    }
  };


  /* ---------------- BROWSER LOCATION ---------------- 
  const useBrowserLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        mapRef.current?.setCenter({ lat: latitude, lng: longitude });

        setLat(latitude);
        setLng(longitude);

        fetchAddress(latitude, longitude);
      },
      () => {
        alert("GPS permission required.");
        setLoading(false);
      }
    );
  };

  const confirmLocation = () => {

    if (!geo) return alert("Location not selected!");
    if (!deliveryAvailable) return alert("Sorry! Delivery not available here.");

   
    navigate("/addressdetail", {
      state: {
        source,
        allowedPincodes: computedAllowedPincodes,
        prefillAddress: {
          fullAddress: address,
          city: geo.city,
          state: geo.state,
          pincode: geo.pincode,
          latitude: String(geo.latitude),
          longitude: String(geo.longitude),
        },
      },
    });
  };


  /* ---------------- UI ---------------- 
  return (
    <View style={styles.container}>
      <CustomHeader title="Current Location" />

      <View id="map" style={styles.map}></View>

      <View style={styles.pin}>
        <MapPin size={30} color="#ff4444" />
      </View>

      <TouchableOpacity style={styles.searchBar} onPress={() => setModalVisible(true)}>
        <Search size={18} />
        <Text style={{ marginLeft: 8, color: "#444" }}>
          Search for a location...
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSheet}>
        <Text style={styles.title}>Your order will be delivered here</Text>

        <Text style={styles.address}>
          {loading ? "Fetching address..." : address || "Move the map"}
        </Text>

        {!deliveryAvailable && geo?.pincode && (
          <Text style={styles.unavailable}>Delivery not available here</Text>
        )}

        <TouchableOpacity style={styles.greenBtn} onPress={useBrowserLocation}>
          <Navigation size={18} color="#fff" />
          <Text style={styles.greenBtnText}>Use Current Location</Text>
        </TouchableOpacity>

        {deliveryAvailable && (
          <TouchableOpacity style={styles.redBtn} onPress={confirmLocation}>
            <Text style={styles.redBtnText}>Confirm Location</Text>
          </TouchableOpacity>
        )}
      </View>

      <LocationSearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUseCurrentLocation={() => {
          setModalVisible(false);
          useBrowserLocation();
        }}
        onSelectLocation={(pid, desc, g) => {
          if (g) handlePlaceSelect(g.latitude, g.longitude, desc, g);
          setModalVisible(false);
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1333c0ff" },
  map: { width: "100%", height: MAP_HEIGHT },
  pin: {
    position: "absolute",
    top: "31%",
    left: "50%",
    marginLeft: -20,
    zIndex: 10,
  },
  searchBar: {
    position: "absolute",
    top: 60,
    left: "5%",
    //transform: [{ translateX: -150 }],
    width: "90%",
    padding: 8,
    backgroundColor: "#d8dcd8ff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    paddingBottom: 5,
    backgroundColor: "#f2e5e5ff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    maxHeight: "50%",
  },
  title: { fontSize: 14, fontWeight: "600" },
  address: { marginTop: 4, color: "#444", fontSize: 13 },
  unavailable: { marginTop: 6, color: "red", fontWeight: "700" },
  greenBtn: {
    marginTop: 14,
    backgroundColor: "#00BA3C",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  greenBtnText: { color: "#fff", fontWeight: "700" },
  redBtn: {
    marginTop: 12,
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  redBtnText: { color: "#fff", fontWeight: "700" },
});

export default CurrentLocationScreen;                 */





import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Navigation, Search } from "lucide-react";
import axios from "axios";
import LocationSearchModal from "./LocationSearchModal";
import { GOOGLE_MAP_API } from "@service/config";
import CustomHeader from "@components/ui/CustomHeader";
import { useLocationStorePincode } from "@state/locationStore";

const MAP_HEIGHT = Dimensions.get("window").height;   // FULL height


/* ---------------- GOOGLE LOADER ---------------- */
const loadGoogleMaps = () =>
  new Promise<void>((resolve, reject) => {
    if (window.google) {
      return resolve();
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => reject("Google Maps load failed");
    document.head.appendChild(script);
  });


const CurrentLocationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- GET PARAMS FROM NAVIGATION ---------------- */
/* ---------------- SAFE PARAM EXTRACTION (URL + localStorage) ---------------- */
const { search, state } = location;
const query = new URLSearchParams(search);

// URL se try karo
let allowedPincodes: string[] = [];
let source: string | null = query.get("source") || null;
const pinsParam = query.get("pins");

// URL pins
if (pinsParam) {
  allowedPincodes = pinsParam.split(",").map((p) => p.trim());
}

// FALLBACK → navigation.state
if (allowedPincodes.length === 0 && state?.allowedPincodes) {
  allowedPincodes = state.allowedPincodes;
  if (!source) source = state.source || null;
}

// FINAL FALLBACK → localStorage
if (allowedPincodes.length === 0) {
  try {
    const cached = localStorage.getItem("CURRENT_LOCATION_META");
    if (cached) {
      const json = JSON.parse(cached);
      allowedPincodes = json.allowedPincodes || [];
      if (!source) source = json.source || null;
    }
  } catch {}
}


  /* ---------------- GLOBAL PINCODE LIST ---------------- */
  const { locationData, fetchLocationData } = useLocationStorePincode();

  const mapRef = useRef<any>(null);

  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);

  const [address, setAddress] = useState("");
  const [geo, setGeo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [computedAllowedPincodes, setComputedAllowedPincodes] = useState<string[]>([]);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);


  /* ---------------- FETCH LOCATION DATA IF NEEDED ---------------- */
  useEffect(() => {
    if (!locationData || locationData.length === 0) {
      fetchLocationData();
    }
  }, []);

  /* ---------------- MERGE PINCODES ---------------- */
  useEffect(() => {

    if (!locationData || locationData.length === 0) {
      return;
    }

    const pincodeMap: Record<string, string[]> = {};

    locationData.forEach((s: any) => {
      s.districts?.forEach((d: any) => {
        pincodeMap[d.name] = d.pincodes?.map((p: any) => String(p.code)) || [];
      });
    });

    const allPins = Object.values(pincodeMap).flat();

    const merged = Array.from(new Set([...allPins, ...allowedPincodes]));
    setComputedAllowedPincodes(merged);
  }, [locationData]);


  /* ---------------- INIT MAP ---------------- */
  const initMap = () => {

    const map = new google.maps.Map(document.getElementById("map")!, {
      center: { lat, lng },
      zoom: 16,
      disableDefaultUI: true,
      gestureHandling: "greedy",      
      fullscreenControl: false,
    });

    mapRef.current = map;

    map.addListener("dragend", () => {
      const c = map.getCenter();

      if (!c) return;
      setLat(c.lat());
      setLng(c.lng());
      fetchAddress(c.lat(), c.lng());
    });
  };

  
useEffect(() => {

  loadGoogleMaps()
    .then(() => {
      initMap();
      setTimeout(() => useBrowserLocation(), 400);
    })
    .catch((err) => {
      alert("Failed to load Google Maps");
    });
}, []);


  /* ---------------- GEO + PINCODE CHECK ---------------- */
  const fetchAddress = async (lt: number, ln: number) => {

    setLoading(true);

    try {
      const res = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        { params: { latlng: `${lt},${ln}`, key: GOOGLE_MAP_API } }
      );

      const result = res.data.results[0];

      if (!result) {
        return;
      }

      const parts = result.address_components;
      const get = (t: string) =>
        parts.find((c: any) => c.types.includes(t))?.long_name || "";

      const d = {
        formatted: result.formatted_address,
        pincode: get("postal_code"),
        city: get("locality") || get("administrative_area_level_2"),
        state: get("administrative_area_level_1"),
        latitude: lt,
        longitude: ln,
      };

      setAddress(d.formatted);
      setGeo(d);

      const pin = String(d.pincode);

      const finalPins = [
        ...computedAllowedPincodes.map(String),
        ...allowedPincodes.map(String)
      ];


      const available = finalPins.includes(pin);

      setDeliveryAvailable(available);
    } catch (e) {
      console.warn("❌ Geocode error:", e);
    }

    setLoading(false);
  };


  /* ---------------- SEARCH MODAL SELECT ---------------- */
  const handlePlaceSelect = (lt: number, ln: number, desc: string, g?: any) => {

    mapRef.current?.setCenter({ lat: lt, lng: ln });
    setLat(lt);
    setLng(ln);
    setAddress(desc);

     fetchAddress(lt, ln);

    if (g) {
      setGeo(g);

      const pin = String(g.pincode);
      const finalPins = [...computedAllowedPincodes, ...allowedPincodes];

      setDeliveryAvailable(finalPins.includes(pin));
    }
  };


  /* ---------------- BROWSER LOCATION ---------------- */
  const useBrowserLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        mapRef.current?.setCenter({ lat: latitude, lng: longitude });

        setLat(latitude);
        setLng(longitude);

        fetchAddress(latitude, longitude);
      },
      () => {
        alert("GPS permission required.");
        setLoading(false);
      }
    );
  };

  const confirmLocation = () => {

    if (!geo) return alert("Location not selected!");
    if (!deliveryAvailable) return alert("Sorry! Delivery not available here.");

   
    navigate("/addressdetail", {
      state: {
        source,
        allowedPincodes: computedAllowedPincodes,
        prefillAddress: {
          fullAddress: address,
          city: geo.city,
          state: geo.state,
          pincode: geo.pincode,
          latitude: String(geo.latitude),
          longitude: String(geo.longitude),
        },
      },
    });
  };


  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      <CustomHeader title="Current Location" />

      <View id="map" style={styles.map}></View>

      <View style={styles.pin}>
        <MapPin size={30} color="#ff4444" />
      </View>

      <TouchableOpacity style={styles.searchBar} onPress={() => setModalVisible(true)}>
        <Search size={18} />
        <Text style={{ marginLeft: 8, color: "#444" }}>
          Search for a location...
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSheet}>
        <Text style={styles.title}>Your order will be delivered here</Text>

        <Text style={styles.address}>
          {loading ? "Fetching address..." : address || "Move the map"}
        </Text>

        {!deliveryAvailable && geo?.pincode && (
          <Text style={styles.unavailable}>Delivery not available here</Text>
        )}

        <TouchableOpacity style={styles.greenBtn} onPress={useBrowserLocation}>
          <Navigation size={18} color="#fff" />
          <Text style={styles.greenBtnText}>Use Current Location</Text>
        </TouchableOpacity>

        {deliveryAvailable && (
          <TouchableOpacity style={styles.redBtn} onPress={confirmLocation}>
            <Text style={styles.redBtnText}>Confirm Location</Text>
          </TouchableOpacity>
        )}
      </View>

      <LocationSearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUseCurrentLocation={() => {
          setModalVisible(false);
          useBrowserLocation();
        }}
        onSelectLocation={(pid, desc, g) => {
          if (g) handlePlaceSelect(g.latitude, g.longitude, desc, g);
          setModalVisible(false);
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1333c0ff" },
  map: { width: "100%", height: MAP_HEIGHT },
  pin: {
    position: "absolute",
    top: "31%",
    left: "50%",
    marginLeft: -20,
    zIndex: 10,
  },
  searchBar: {
    position: "absolute",
    top: 60,
    left: "5%",
    //transform: [{ translateX: -150 }],
    width: "90%",
    padding: 8,
    backgroundColor: "#d8dcd8ff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    paddingBottom: 5,
    backgroundColor: "#f2e5e5ff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    maxHeight: "50%",
  },
  title: { fontSize: 14, fontWeight: "600" },
  address: { marginTop: 4, color: "#444", fontSize: 13 },
  unavailable: { marginTop: 6, color: "red", fontWeight: "700" },
  greenBtn: {
    marginTop: 14,
    backgroundColor: "#00BA3C",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  greenBtnText: { color: "#fff", fontWeight: "700" },
  redBtn: {
    marginTop: 12,
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  redBtnText: { color: "#fff", fontWeight: "700" },
});

export default CurrentLocationScreen;

