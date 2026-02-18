import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useParams, useNavigate } from "react-router-dom";
import CustomHeader from "@components/ui/CustomHeader";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import { submitBankDetails } from "@service/productService";

const BankDetailsScreen: FC = () => {
  const { returnId } = useParams<{ returnId: string }>();
  const navigate = useNavigate();

  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validate = () => {
    if (!accountHolderName.trim())
      return "Account holder name is required";

    if (!accountNumber || accountNumber.length < 8)
      return "Enter valid account number";

    if (accountNumber !== confirmAccountNumber)
      return "Account numbers do not match";

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode))
      return "Invalid IFSC code (Example: SBIN0001234)";

    if (!bankName.trim())
      return "Bank name is required";

    return null;
  };

  const handleSubmit = async () => {
    if (!returnId) {
      setErrorMsg("Invalid return ID");
      return;
    }

    const error = validate();
    if (error) {
      setErrorMsg(error);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      await submitBankDetails(returnId, {
        accountHolderName,
        accountNumber,
        ifscCode,
        bankName,
      });

      navigate("/deliveredorderdetails");
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || "Failed to submit bank details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="🏦 Bank Details" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <CustomText style={styles.infoText}>
          Please provide your bank details to process refund.
        </CustomText>

        {errorMsg && (
          <CustomText style={styles.errorText}>{errorMsg}</CustomText>
        )}

        <TextInput
          style={styles.input}
          placeholder="Account Holder Name"
          value={accountHolderName}
          onChangeText={setAccountHolderName}
        />

        <TextInput
          style={styles.input}
          placeholder="Account Number"
          keyboardType="number-pad"
          value={accountNumber}
          onChangeText={setAccountNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Account Number"
          keyboardType="number-pad"
          value={confirmAccountNumber}
          onChangeText={setConfirmAccountNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="IFSC Code"
          autoCapitalize="characters"
          value={ifscCode}
          onChangeText={(text) => setIfscCode(text.toUpperCase())}
        />

        <TextInput
          style={styles.input}
          placeholder="Bank Name"
          value={bankName}
          onChangeText={setBankName}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <CustomText style={styles.buttonText} fontFamily={Fonts.Medium}>
              Submit Details
            </CustomText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scroll: {
    padding: 16,
    paddingBottom: 60,
  },
  infoText: {
    marginBottom: 16,
    color: Colors.primary,
  },
  errorText: {
    color: "red",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
  },
});

export default BankDetailsScreen;
