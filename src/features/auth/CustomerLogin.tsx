import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Colors, Fonts } from "@utils/Constants";
import { customerLogin } from "@service/authService";
import { mmkvStorage } from "@state/storage";
import CustomButton from "@components/ui/CustomButton";
import { useAuthStore } from "@state/authStore";

const CustomerLogin: React.FC = () => {
   const navigateTo = useNavigate();
  const { setUser, user } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"name" | "phone">("name");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigateTo("/profile", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleNext = () => {
    if (!fullName.trim()) return alert("Please enter your full name");
    mmkvStorage.setItem("userFullName", fullName);
    setStep("phone");
  };

  const handleAuth = async () => {
    if (phoneNumber.length !== 10)
      return alert("Please enter a valid 10-digit phone number");

    setLoading(true);
    try {
      const userData = await customerLogin(phoneNumber, fullName);
      setUser({ fullName, phone: phoneNumber, ...userData });
      mmkvStorage.setItem("isLoggedIn", "true");
        navigateTo("/profile", { replace: true });
    } catch {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.card,
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <h1 style={styles.logo}>PALTAN</h1>
        <p style={styles.subtitle}>
          Delivering daily essentials faster than ever ⚡
        </p>

        <div style={styles.content}>
          {step === "name" ? (
            <>
              <h2 style={styles.heading}>Let’s get to know you 👋</h2>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
              />
              <CustomButton
                disable={!fullName.trim()}
                loading={loading}
                title="Next ➝"
                onPress={handleNext}
              />
            </>
          ) : (
            <>
              <h2 style={styles.heading}>Enter your phone number 📱</h2>
              <div style={styles.phoneInput}>
                <span style={styles.prefix}>+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  placeholder="10-digit number"
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  style={styles.input}
                />
              </div>
              <CustomButton
                disable={phoneNumber.length !== 10}
                loading={loading}
                title="Continue"
                onPress={handleAuth}
              />
            </>
          )}
        </div>

        <p style={styles.terms}>
          By continuing, you agree to our{" "}
          <span
            style={styles.link}
            onClick={() =>
              navigateTo("/LegalInformationScreen", {
                state: { title: "Terms & Conditions" },
              })
            }
          >
            Terms of Service
          </span>{" "}
          &{" "}
          <span
            style={styles.link}
            onClick={() =>
              navigateTo("/LegalInformationScreen", {
                state: { title: "Privacy Policy" },
              })
            }
          >
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
};

/* -------------------------- STYLES -------------------------- */
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    padding: 20,
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
    color: "white",
    width: "90%",
    maxWidth: 380,
    padding: "35px 25px",
    textAlign: "center",
    transition: "all 0.8s ease",
  },
  logo: {
    fontSize: 36,
    letterSpacing: 1.5,
    fontFamily: "Poppins, sans-serif",
    background: "linear-gradient(to right, #ff9966, #ff5e62)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 30,
  },
  heading: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 14,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  input: {
    width: "90%",
    padding: "7px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    transition: "all 0.3s ease",
  },
  phoneInput: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  prefix: {
    fontSize: 15,
    opacity: 0.8,
  },
  terms: {
    marginTop: 25,
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    lineHeight: "1.5em",
  },
  link: {
    textDecoration: "underline",
    color: "#FF7E7E",
    cursor: "pointer",
  },
};

export default CustomerLogin;
