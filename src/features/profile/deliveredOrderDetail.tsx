import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { getOrderById } from '@service/orderService';
import { Colors, Fonts } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import OrderSummary from '@features/map/OrderSummary';
import { useAuthStore } from '@state/authStore';
import CustomHeader from '@components/ui/CustomHeader';
import { navigate } from '@utils/NavigationUtils';

const DeliveredOrderDetails: FC = () => {
  const { currentOrder, setCurrentOrder } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    if (!currentOrder?._id) {return;} // safeguard
    try {
      setLoading(true);
      const data = await getOrderById(currentOrder._id);
      setCurrentOrder(data);
    } catch (err) {
      console.warn('Failed to fetch order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading || !currentOrder) {
    return (
      <View style={[styles.Container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.Container}>
      <CustomHeader title={'🛍️ Order History'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
       <TouchableOpacity
  style={styles.downloadButton}
  onPress={() => navigate('InvoiceDownload')}
>
  <Icon name="file-download-outline" size={20} color="white" />
  <CustomText style={styles.downloadText} variant="h8" fontFamily={Fonts.Medium}>
    Download Invoice
  </CustomText>
</TouchableOpacity>


        <OrderSummary order={currentOrder} />

        <CustomText variant="h6" fontFamily={Fonts.SemiBold} style={{ opacity: 0.6, marginTop: 20 }}>
          Powered By Paltan
        </CustomText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  downloadButton: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  downloadText: {
    color: 'white',
  },
  Container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  scrollContent: {
    paddingBottom: 100,
    padding: 15,
    backgroundColor: Colors.backgroundSecondary,
  },
  flexRow: {
    marginTop: 15,
    backgroundColor: '#fff',
    paddingVertical: 10,
    padding: 10,
    width: '100%',
    borderRadius: 15,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 0.7,
  },
  iconContainer: {
    borderRadius: 100,
    borderColor: Colors.border,
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.backgroundSecondary,
  },
});

export default DeliveredOrderDetails;
