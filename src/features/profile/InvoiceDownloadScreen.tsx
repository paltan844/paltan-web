import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { Linking } from 'react-native';
import { Colors } from '@utils/Constants';
import CustomHeader from '@components/ui/CustomHeader';
import CustomText from '@components/ui/CustomText';
import { useAuthStore } from '@state/authStore';
import { getInvoiceUrlByOrderId } from '@service/orderService';

const InvoiceDownloadScreen = () => {
  const { currentOrder } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceUrl = async () => {
      if (!currentOrder?._id) {
        Alert.alert('Error', 'No order found');
        setLoading(false);
        return;
      }
      try {
        const res = await getInvoiceUrlByOrderId(currentOrder._id);
        if (!res?.pdfUrl) {throw new Error('Invoice URL not found');}

        setPdfUrl(res.pdfUrl);
      } catch (err: any) {
        console.error(err);
        Alert.alert('Error', err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceUrl();
  }, [currentOrder]);

  const openInvoice = () => {
    if (!pdfUrl) {
      Alert.alert('Error', 'Invoice URL not available');
      return;
    }

    Linking.openURL(pdfUrl).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Could not open invoice');
    });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Invoice" />
      <View style={styles.content}>
        {loading ? (
          <>
            <ActivityIndicator size="large" color={Colors.primary} />
            <CustomText style={{ marginTop: 10 }}>Loading Invoice...</CustomText>
          </>
        ) : (
          <>
            <CustomText style={{ marginBottom: 20 }}>
              Invoice is ready! Tap below to view.
            </CustomText>
            <Button title="Open Invoice" onPress={openInvoice} color={Colors.primary} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default InvoiceDownloadScreen;
