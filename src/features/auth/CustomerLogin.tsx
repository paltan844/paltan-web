
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@components/ui/CustomButton";
import { useAuthStore } from "@state/authStore";
import { mmkvStorage } from "@state/storage";
import {
  clearAuthStorage,
  setAccessToken,
  setRefreshToken,
  setUserStorage,
} from "@utils/webAuthStorage";
import {
  sendEmailOtp,
  verifyEmailOtpAndLogin,
} from "@service/authService";


const CustomerLogin: React.FC = () => {
  const navigateTo = useNavigate();
  const { setUser, user } = useAuthStore();

  const [step, setStep] = useState<
    "name" | "phone" | "email" | "emailOtp"
  >("name");

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      navigateTo("/profile", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleNextName = () => {
    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }
    mmkvStorage.setItem("userFullName", fullName);
    setStep("phone");
  };

  const handleNextPhone = () => {
    if (phoneNumber.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }
    setStep("email");
  };

  const handleSendEmailOtp = async () => {
    setLoading(true);
    try {
      await sendEmailOtp(email);
      setStep("emailOtp");
    } catch {
      alert("Failed to send email OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      clearAuthStorage();

      const res = await verifyEmailOtpAndLogin({
        fullName,
        phoneNumber,
        email,
        otp: emailOtp,
      });

      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      setUser(res.customer);
      setUserStorage(res.customer);

      navigateTo("/profile", { replace: true });
    } catch {
      alert("Invalid OTP");
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
        
          {step === "name" && (
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
                onPress={handleNextName}
              />
            </>
          )}

          
          {step === "phone" && (
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
                title="Next ➝"
                onPress={handleNextPhone}
              />
            </>
          )}

          {/* EMAIL */}
          {step === "email" && (
            <>
              <h2 style={styles.heading}>Verify your email 📧</h2>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />

              <CustomButton
                disable={!email.includes("@")}
                loading={loading}
                title="Send Email OTP"
                onPress={handleSendEmailOtp}
              />
            </>
          )}

          {step === "emailOtp" && (
            <>
              <h2 style={styles.heading}>Enter Email OTP 🔐</h2>

              <input
                type="tel"
                maxLength={6}
                value={emailOtp}
                placeholder="6-digit OTP"
                onChange={(e) =>
                  setEmailOtp(e.target.value.replace(/\D/g, ""))
                }
                style={styles.input}
              />

              <CustomButton
                disable={emailOtp.length !== 6}
                loading={loading}
                title="Verify & Continue"
                onPress={handleVerifyOtp}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};


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
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    color: "#fff",
    width: "90%",
    maxWidth: 380,
    padding: "35px 25px",
    textAlign: "center",
    transition: "all 0.8s ease",
  },
  logo: {
    fontSize: 36,
    letterSpacing: 1.5,
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
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 15,
    outline: "none",
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
};

export default CustomerLogin;
