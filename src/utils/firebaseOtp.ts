import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

let confirmationResult: ConfirmationResult | null = null;

export const setupRecaptcha = () => {
  if (!(window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // recaptcha solved
        },
      }
    );
  }
};

/* ✅ OTP SEND */
export const sendOtp = async (phone: string) => {
  setupRecaptcha();
  const appVerifier = (window as any).recaptchaVerifier;

  confirmationResult = await signInWithPhoneNumber(
    auth,
    "+91" + phone,
    appVerifier
  );
};

/* ✅ OTP VERIFY */
export const verifyOtp = async (code: string) => {
  if (!confirmationResult) throw new Error("OTP not requested");
  await confirmationResult.confirm(code);
};
