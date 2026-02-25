/*
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { getOrderById } from "@service/orderService";
import { Colors, Fonts } from "@utils/Constants";
import {IoDownloadOutline,IoInformationCircleOutline,
        IoArrowUndoOutline,} from "react-icons/io5";
import CustomText from "@components/ui/CustomText";
import OrderSummary from "@features/map/OrderSummary";
import { useAuthStore } from "@state/authStore";
import CustomHeader from "@components/ui/CustomHeader";
import { navigate } from "@utils/NavigationUtils";

const DeliveredOrderDetails: FC = () => {
  const { currentOrder, setCurrentOrder } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentOrder?._id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getOrderById(currentOrder._id);
        setCurrentOrder(data);
      } catch (e) {
        console.warn("Order fetch failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !currentOrder) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  //const isDelivered = currentOrder.status === "delivered";
  const canReturn = currentOrder.canReturn === true;
  const hasReturn = currentOrder.hasReturn;
  const returnStatus = currentOrder.returnStatus; 
  // requested | approved | completed

  return (
    <View style={styles.container}>
      <CustomHeader title="🛍️ Order details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      
        <TouchableOpacity style={styles.invoiceBtn}>
          <IoDownloadOutline size={20} color="#fff" />
          <CustomText style={styles.invoiceText} fontFamily={Fonts.Medium}>
            Download invoice
          </CustomText>
        </TouchableOpacity>

       {canReturn && (
  <View style={styles.infoCard}>
    <IoInformationCircleOutline size={20} />
    <CustomText style={styles.infoText}>
      Only{" "}
      <CustomText fontFamily={Fonts.SemiBold}>
        damaged products
      </CustomText>{" "}
      can be returned within{" "}
      <CustomText fontFamily={Fonts.SemiBold}>
        24 hours
      </CustomText>{" "}
      of delivery.
    </CustomText>
  </View>
)}

{canReturn && (
  <View style={styles.returnCard}>
    <View style={styles.returnRow}>
      <IoArrowUndoOutline size={22} color={Colors.primary} />

      <View style={{ flex: 1 }}>
        {!hasReturn && (
          <>
            <CustomText fontFamily={Fonts.SemiBold}>
              Want to return items?
            </CustomText>
            <CustomText style={styles.subText}>
              Select damaged items and submit a return request
            </CustomText>
          </>
        )}

        {hasReturn && returnStatus === "requested" && (
          <>
            <CustomText fontFamily={Fonts.SemiBold}>
              Return requested
            </CustomText>
            <CustomText style={styles.subText}>
              We are reviewing your request
            </CustomText>
          </>
        )}

        {hasReturn && returnStatus === "approved" && (
          <>
            <CustomText fontFamily={Fonts.SemiBold}>
              Return approved
            </CustomText>
            <CustomText style={styles.subText}>
              Continue to complete return
            </CustomText>
          </>
        )}

        {hasReturn && returnStatus === "completed" && (
          <>
            <CustomText fontFamily={Fonts.SemiBold}>
              Return completed
            </CustomText>
            <CustomText style={styles.subText}>
              Refund has been processed
            </CustomText>
          </>
        )}
      </View>

  
      {!hasReturn && (
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigate("/return-items")}
        >
          <CustomText style={styles.ctaText}>
            Return
          </CustomText>
        </TouchableOpacity>
      )}

      {hasReturn && returnStatus === "approved" && (
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigate("/return-items")}
        >
          <CustomText style={styles.ctaText}>
            Continue
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  </View>
)}

    
        <OrderSummary order={currentOrder} />

        <CustomText
          style={styles.footer}
          fontFamily={Fonts.Medium}
        >
          Powered by Paltan
        </CustomText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: Colors.backgroundSecondary,
  },

  
  invoiceBtn: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  invoiceText: {
    color: "#fff",
  },


  infoCard: {
    marginTop: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
    color: 'red',
  },

  
  returnCard: {
    marginTop: 16,
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  returnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  subText: {
    marginTop: 4,
    opacity: 0.6,
  },


  ctaBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: "#fff",
    fontFamily: Fonts.Medium,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    opacity: 0.5,
  },
});

export default DeliveredOrderDetails;
*/




/*
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { getOrderById } from "@service/orderService";
import { Colors, Fonts } from "@utils/Constants";
import {
  IoDownloadOutline,
  IoInformationCircleOutline,
  IoArrowUndoOutline,
} from "react-icons/io5";
import CustomText from "@components/ui/CustomText";
import OrderSummary from "@features/map/OrderSummary";
import { useAuthStore } from "@state/authStore";
import CustomHeader from "@components/ui/CustomHeader";
import { navigate } from "@utils/NavigationUtils";

const getReturnUIState = (order: any) => {
  const rr = order.returnRequest;


if (!order.hasReturn) {
  // ✅ Only show button if within 24h
  if (order.canReturn) {
    console.log("✅ UI STATE → WANT TO RETURN (WITHIN 24H)");
    return {
      title: "Want to return items?",
      subtitle: "Select damaged items and submit a return request",
      showCTA: true,
      ctaText: "Return",
      onPress: () => navigate("/return-items"),
    };
  }
 return null;
}

  if (!rr) {
    console.log("❌ returnRequest missing");
    return null;
  }


  if (rr.returnStatus === "requested") {
    return {
      title: "Return request submitted",
      subtitle: "Your request is under review. Please wait for confirmation.",
      showCTA: false,
    };
  }

  if (rr.returnStatus === "rejected") {
    return {
      title: "Return request rejected",
      subtitle:
        rr.remarks ||
        "Your return request was rejected as per our policy.",
      showCTA: false,
    };
  }

  if (rr.returnStatus === "approved" && rr.resolutionType === "none") {
    return {
      title: "Return approved",
      subtitle: "Admin will complete the further return process.",
     // showCTA: true,
      //ctaText: "Continue",
      //onPress: () => navigate("/return-items"),
    };
  }

  if (rr.resolutionType === "exchange") {
    const map: any = {
      pending: "Replacement will be picked up soon",
      picked: "Replacement picked up",
      out_for_delivery: "Replacement out for delivery",
      delivered: "Replacement delivered successfully",
    };

    return {
      title: "Exchange in progress",
      subtitle: map[rr.exchangeStatus] || "Exchange initiated",
      showCTA: false,
    };
  }



if (rr.resolutionType === "refund") {

  if (rr.refundStatus === "bank_details_required") {
    return {
      title: "Bank details required",
      subtitle: "Please submit your bank details to receive refund.",
      showCTA: true,
      ctaText: "Submit Details",
     onPress: () => navigate(`/bank-details/${rr._id}`)
    };
  }

  if (rr.refundStatus === "bank_details_received") {
    return {
      title: "Refund processing",
      subtitle: "Your bank details are received. Refund is being processed.",
      showCTA: false,
    };
  }

  if (rr.refundStatus === "processed") {
    return {
      title: "Refund completed",
      subtitle: `Refund of ₹${rr.refundAmount} has been processed successfully.`,
      showCTA: false,
    };
  }

  if (rr.refundStatus === "failed") {
    return {
      title: "Refund failed",
      subtitle: "Refund failed. Please contact support.",
      showCTA: false,
    };
  }

  return {
    title: "Refund initiated",
    subtitle: "Refund request is under processing.",
    showCTA: false,
  };
}


  if (rr.returnStatus === "completed") {
    return {
      title: "Return completed",
      subtitle: "Your return has been completed successfully.",
      showCTA: false,
    };
  }
  return null;
};

const DeliveredOrderDetails: FC = () => {
  const { currentOrder, setCurrentOrder } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentOrder?._id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getOrderById(currentOrder._id);
        if (data) setCurrentOrder(data);
      } catch (e) {
        console.warn("Order fetch failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentOrder?._id]);

  if (loading || !currentOrder) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const canReturn = Boolean(currentOrder.canReturn);
  const hasReturn = Boolean(currentOrder.hasReturn);
  const ui = getReturnUIState(currentOrder);

  return (
    <View style={styles.container}>
      <CustomHeader title="🛍️ Order details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.invoiceBtn}>
          <IoDownloadOutline size={20} color="#fff" />
          <CustomText style={styles.invoiceText} fontFamily={Fonts.Medium}>
            Download invoice
          </CustomText>
        </TouchableOpacity>

        {canReturn && (
          <View style={styles.infoCard}>
            <IoInformationCircleOutline size={20} />
            <CustomText style={styles.infoText}>
              Only{" "}
              <CustomText fontFamily={Fonts.SemiBold}>
                damaged products
              </CustomText>{" "}
              can be returned within{" "}
              <CustomText fontFamily={Fonts.SemiBold}>
                24 hours
              </CustomText>{" "}
              of delivery.
            </CustomText>
          </View>
        )}

{ui && (
  <View style={styles.returnCard}>
    <View style={styles.returnRow}>
      <IoArrowUndoOutline size={22} color={Colors.primary} />

      <View style={{ flex: 1 }}>
        <CustomText fontFamily={Fonts.SemiBold}>
          {ui.title}
        </CustomText>
        <CustomText style={styles.subText}>
          {ui.subtitle}
        </CustomText>
      </View>

      {ui.showCTA && (
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={ui.onPress}
        >
          <CustomText style={styles.ctaText}>
            {ui.ctaText}
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  </View>
)}

        <OrderSummary order={currentOrder} />

        <CustomText style={styles.footer} fontFamily={Fonts.Medium}>
          Powered by Paltan
        </CustomText>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: Colors.backgroundSecondary,
  },

  invoiceBtn: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  invoiceText: {
    color: "#fff",
  },

  infoCard: {
    marginTop: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
    color: "red",
  },

  returnCard: {
    marginTop: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  returnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  subText: {
    marginTop: 4,
    opacity: 0.6,
  },

  ctaBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: "#fff",
    fontFamily: Fonts.Medium,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    opacity: 0.5,
  },
});

export default DeliveredOrderDetails;
*/


import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { getOrderById } from "@service/orderService";
import { Colors, Fonts } from "@utils/Constants";
import {
  IoDownloadOutline,
  IoInformationCircleOutline,
  IoArrowUndoOutline,
} from "react-icons/io5";
import CustomText from "@components/ui/CustomText";
import OrderSummary from "@features/map/OrderSummary";
import { useAuthStore } from "@state/authStore";
import CustomHeader from "@components/ui/CustomHeader";
import { navigate } from "@utils/NavigationUtils";

const getReturnUIState = (order: any) => {
  const rr = order.returnRequest;


if (!order.hasReturn) {
  // ✅ Only show button if within 24h
  if (order.canReturn) {
    console.log("✅ UI STATE → WANT TO RETURN (WITHIN 24H)");
    return {
      title: "Want to return items?",
      subtitle: "Select damaged items and submit a return request",
      showCTA: true,
      ctaText: "Return",
      onPress: () => navigate("/return-items"),
    };
  }
 return null;
}

  if (!rr) {
    console.log("❌ returnRequest missing");
    return null;
  }


  if (rr.returnStatus === "requested") {
    return {
      title: "Return request submitted",
      subtitle: "Your request is under review. Please wait for confirmation.",
      showCTA: false,
    };
  }

  if (rr.returnStatus === "rejected") {
    return {
      title: "Return request rejected",
      subtitle:
        rr.remarks ||
        "Your return request was rejected as per our policy.",
      showCTA: false,
    };
  }

  if (rr.returnStatus === "approved" && rr.resolutionType === "none") {
    return {
      title: "Return approved",
      subtitle: "Admin will complete the further return process.",
     // showCTA: true,
      //ctaText: "Continue",
      //onPress: () => navigate("/return-items"),
    };
  }

  if (rr.resolutionType === "exchange") {
    const map: any = {
      pending: "Replacement will be picked up soon",
      picked: "Replacement picked up",
      out_for_delivery: "Replacement out for delivery",
      delivered: "Replacement delivered successfully",
    };

    return {
      title: "Exchange in progress",
      subtitle: map[rr.exchangeStatus] || "Exchange initiated",
      showCTA: false,
    };
  }



if (rr.resolutionType === "refund") {

  if (rr.refundStatus === "bank_details_required") {
    return {
      title: "Bank details required",
      subtitle: "Please submit your bank details to receive refund.",
      showCTA: true,
      ctaText: "Submit Details",
     onPress: () => navigate(`/bank-details/${rr._id}`)
    };
  }

  if (rr.refundStatus === "bank_details_received") {
    return {
      title: "Refund processing",
      subtitle: "Your bank details are received. Refund is being processed.",
      showCTA: false,
    };
  }

  if (rr.refundStatus === "processed") {
    return {
      title: "Refund completed",
      subtitle: `Refund of ₹${rr.refundAmount} has been processed successfully.`,
      showCTA: false,
    };
  }

  if (rr.refundStatus === "failed") {
    return {
      title: "Refund failed",
      subtitle: "Refund failed. Please contact support.",
      showCTA: false,
    };
  }

  return {
    title: "Refund initiated",
    subtitle: "Refund request is under processing.",
    showCTA: false,
  };
}


  if (rr.returnStatus === "completed") {
    return {
      title: "Return completed",
      subtitle: "Your return has been completed successfully.",
      showCTA: false,
    };
  }
  return null;
};

const DeliveredOrderDetails: FC = () => {
  const { currentOrder, setCurrentOrder } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentOrder?._id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getOrderById(currentOrder._id);
        if (data) setCurrentOrder(data);
      } catch (e) {
        console.warn("Order fetch failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentOrder?._id]);

  if (loading || !currentOrder) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const canReturn = Boolean(currentOrder.canReturn);
  const hasReturn = Boolean(currentOrder.hasReturn);
  const ui = getReturnUIState(currentOrder);

  return (
    <View style={styles.container}>
      <CustomHeader title="🛍️ Order details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.invoiceBtn}>
          <IoDownloadOutline size={20} color="#fff" />
          <CustomText style={styles.invoiceText} fontFamily={Fonts.Medium}>
            Download invoice
          </CustomText>
        </TouchableOpacity>

        {canReturn && (
          <View style={styles.infoCard}>
            <IoInformationCircleOutline size={20} />
            <CustomText style={styles.infoText}>
              Only{" "}
              <CustomText fontFamily={Fonts.SemiBold}>
                damaged products
              </CustomText>{" "}
              can be returned within{" "}
              <CustomText fontFamily={Fonts.SemiBold}>
                24 hours
              </CustomText>{" "}
              of delivery.
            </CustomText>
          </View>
        )}

{ui && (
  <View style={styles.returnCard}>
    <View style={styles.returnRow}>
      <IoArrowUndoOutline size={22} color={Colors.primary} />

      <View style={{ flex: 1 }}>
        <CustomText fontFamily={Fonts.SemiBold}>
          {ui.title}
        </CustomText>
        <CustomText style={styles.subText}>
          {ui.subtitle}
        </CustomText>
      </View>

      {ui.showCTA && (
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={ui.onPress}
        >
          <CustomText style={styles.ctaText}>
            {ui.ctaText}
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  </View>
)}

        <OrderSummary order={currentOrder} />

        <CustomText style={styles.footer} fontFamily={Fonts.Medium}>
          Powered by Paltan
        </CustomText>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: Colors.backgroundSecondary,
  },

  invoiceBtn: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  invoiceText: {
    color: "#fff",
  },

  infoCard: {
    marginTop: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
    color: "red",
  },

  returnCard: {
    marginTop: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  returnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  subText: {
    marginTop: 4,
    opacity: 0.6,
  },

  ctaBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: "#fff",
    fontFamily: Fonts.Medium,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    opacity: 0.5,
  },
});

export default DeliveredOrderDetails;

