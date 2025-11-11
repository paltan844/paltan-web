import React, { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Alert,
} from "react-native";
import * as Ionicons from "react-icons/io5"; // ✅ Replaced vector-icons with web Ionicons
import { useAuthStore } from "@state/authStore";
import { useCartStore } from "@state/cartStore";
import { useLocationStore } from "@state/locationStore";
import CustomHeader from "@components/ui/CustomHeader";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import { mmkvStorage, tokenStorage } from "@state/storage";
import { navigate } from "@utils/NavigationUtils";
import WalletSection from "./WalletSection";
import ActionButton from "./ActionButton";
import DeviceInfo from "react-native-device-info";
import YourRatingModal from "./Information/YourRatingModal";
import AppearanceModal from "./Information/AppearanceModal";

const getFirstName = (fullName: string | null) => {
  if (!fullName) return "User!";
  const words = fullName.split(" ");
  if (words.length > 1) {
    return `${words[0].charAt(0).toUpperCase()}${words[0]
      .slice(1)
      .toLowerCase()} ${words[1].charAt(0).toUpperCase()}${words[1]
      .slice(1)
      .toLowerCase()}`;
  }
  return (
    words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase()
  );
};

const Profile: FC = () => {
  const currentVersion = DeviceInfo.getVersion();
  const { logout, user } = useAuthStore();
  const { clearCart } = useCartStore();
  const { selectedLocation, setSelectedLocation } = useLocationStore();
  const { resetLocation } = useLocationStore.getState();

  const [fullName, setFullName] = useState<string | null>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  const [showRatingModal, setShowRatingModal] = useState(false);


  const clearAllUserData = () => {
    mmkvStorage.removeItem("userFullName");
    mmkvStorage.removeItem("chat_messages");
    mmkvStorage.removeItem("likedState");
    mmkvStorage.removeItem("shared_app_link");
    mmkvStorage.removeItem("recent_locations");
    mmkvStorage.removeItem("addresses");
    mmkvStorage.removeItem("selectedLocation");

    const savedAddresses = mmkvStorage.getItem("addresses");
    if (savedAddresses) {
      try {
        const addressList = JSON.parse(savedAddresses);
        addressList.forEach((addr: string) => {
          mmkvStorage.removeItem(`addressDetail_${addr}`);
        });
      } catch (e) {
        console.warn("Error clearing address details", e);
      }
    }

    tokenStorage.clearAll();
  };


/*
useEffect(() => {
  // restore Zustand state from storage when Profile loads
  const savedUser = localStorage.getItem("auth-storage");
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser)?.state?.user;
      if (parsed) useAuthStore.setState({ user: parsed });
    } catch {}
  }
}, []);
*/


  useEffect(() => {
    const storedName = mmkvStorage.getItem("userFullName");
    setFullName(storedName);
    const listener = mmkvStorage.addOnValueChangedListener((key) => {
      if (key === "userFullName") {
        const updatedName = mmkvStorage.getItem("userFullName");
        setFullName(updatedName);
      }
    });
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <View style={styles.Container}>
      <CustomHeader title="Profile" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- Profile Info ---------- */}
        <View style={styles.profileContainer}>
          <View style={styles.profileIconContainer}>
            <Ionicons.IoPersonCircleOutline
              size={60}
              color={Colors.lightcolor}
            />
          </View>


          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoRow}>
              <CustomText
                variant="h3"
                fontFamily={Fonts.SemiBold}
                style={{ marginLeft: 0 }}
              >
                {getFirstName(fullName)}
              </CustomText>

              {!user && (
                <TouchableOpacity
                  onPress={() => navigate("CustomerLogin")}
                  style={styles.loginContainer}
                  activeOpacity={0.8}
                >
                  <CustomText
                    variant="h9"
                    fontFamily={Fonts.SemiBold}
                    style={styles.loginText}
                  >
                    Login
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>

            <CustomText
              variant="h8"
              fontFamily={Fonts.Medium}
              style={styles.phoneNumber}
            >
              {user ? user.phone : "Welcome Again"}
            </CustomText>
          </View>
        </View>

        {/* ---------- Wallet & Account ---------- */}
        <>
          <WalletSection user={user} />

          <CustomText variant="h8" style={styles.informativeText}>
            YOUR ACCOUNT
          </CustomText>

<ActionButton
  icon={<Ionicons.IoClipboardOutline size={18} />}
  label="Order Status"
  color={Colors.color}
  onPress={() => {
    if (user) {
      navigate("/kart");
    } else {
      window.alert("Please login first to access your Kart.");
    }
  }}
/>
          <View style={styles.divider} />

        <ActionButton
  icon={<Ionicons.IoChatbubbleEllipsesOutline size={18} />}
  label="Customer Support"
  color={Colors.color}
  onPress={() => {
    if (user) {
      navigate("/customersupport");
    } else {
      // ✅ Web-friendly alert
      window.alert("Please login first to access Customer Support.");
    }
  }}


            //  onPress={() => navigate("/customersupport")}
          />
          <View style={styles.divider} />

          <ActionButton
            icon={<Ionicons.IoEyeOutline size={18} />}
            label="Appearance"
            color={Colors.color}
            onPress={() => setShowThemeModal(true)}
          />
          <View style={styles.divider} />

          <ActionButton
            icon={<Ionicons.IoShareOutline size={18} />}
            label="Share"
            color={Colors.color}
            onPress={() => navigate("/share")}
          />
          <View style={styles.divider} />
        </>

        {/* ---------- Help & Support ---------- */}
        <CustomText variant="h8" style={styles.informativeText}>
          HELP & SUPPORT
        </CustomText>

        <ActionButton
          icon={<Ionicons.IoBookOutline size={18} />}
          label="Address Book"
          color={Colors.color}
        />
        <View style={styles.divider} />

        <ActionButton
          icon={<Ionicons.IoStarOutline size={18} />}
          label="Your Rating"
          color={Colors.color}
          onPress={() => setShowRatingModal(true)}
        />
        <View style={styles.divider} />

        {/* ---------- More Info ---------- */}
        <CustomText variant="h8" style={styles.informativeText}>
          MORE INFORMATION
        </CustomText>

        <ActionButton
          icon={<Ionicons.IoPeopleOutline size={18} />}
          label="About Paltan"
          color={Colors.color}
          onPress={() => navigate("/aboutpaltan")}
        />
        <View style={styles.divider} />

        <ActionButton
          icon={<Ionicons.IoShieldCheckmarkOutline size={18} />}
          label="Terms & Conditions"
          color={Colors.color}
          onPress={() =>
            navigate("/LegalInformationScreen", { title: "Terms & Conditions" })
          }
        />
        <View style={styles.divider} />

        {/* ---------- Login / Logout ---------- */}
        {user ? (
          <ActionButton
            icon={<Ionicons.IoLogOutOutline size={18} />}
            label="Logout"
            color={Colors.color}
   onPress={() => {

  clearAllUserData();
  clearCart();
  logout();
  setSelectedLocation("");
  resetLocation();
  mmkvStorage.clearAll();

  setTimeout(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    navigate("/", { replace: true });
  }, 800);
}}
          />
        ) : (
          <ActionButton
            icon={<Ionicons.IoLogInOutline size={18} />}
            label="Login"
            color={Colors.color}
            onPress={() => navigate("CustomerLogin")}
          />
        )}

        <View style={styles.bottom}>
          <Text>Paltan App Version 1.0.5</Text>
        </View>

        {/* ---------- Modals ---------- */}
        <YourRatingModal
          visible={showRatingModal}
          onClose={() => setShowRatingModal(false)}
        />

        <AppearanceModal
          visible={showThemeModal}
          onClose={() => setShowThemeModal(false)}
          selectedTheme={selectedTheme}
          onSelectTheme={(theme) => {
            setSelectedTheme(theme);
            if (theme === "dark") {
              Alert.alert("Dark theme is currently not available.");
            }
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bottom: {
    marginTop: 15,
    marginBottom: 27,
    color: "black",
    alignItems: "center",
  },
  content: {
    paddingLeft: 0,
    paddingTop: 0,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
  },
  profileIconContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginContainer: {
    backgroundColor: "rgba(4, 24, 104, 0.45)",
    paddingVertical: 3,
    paddingHorizontal: 3,
    marginTop: 5,
    borderRadius: 7,
    marginLeft: 10,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
  },
  phoneNumber: {
    fontWeight: "bold",
    marginTop: 3,
    opacity: 0.7,
  },
  divider: {
    height: 2,
    backgroundColor: "#ddd",
  },
  informativeText: {
    opacity: 0.7,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
     fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",// ✅ use custom font
  },
});

export default Profile;
