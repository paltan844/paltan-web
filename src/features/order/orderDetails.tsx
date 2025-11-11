import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatOrderDate } from '@utils/DateUtils';

interface Props {
  order: any;
}


const OrderDetails: FC<Props> = ({ order }) => {
  return (
    <View style={styles.container}>
      <CustomText fontFamily={Fonts.SemiBold} style={styles.heading}>
        Order details
      </CustomText>

      <View style={styles.row}>
        <Icon name="confirmation-number" size={16} color={Colors.text} />
        <CustomText variant="h8">Order ID</CustomText>
      </View>
      <View style={styles.rows}>
        <CustomText variant="h8">#{order?.orderId || '—'}</CustomText>
      </View>

      <View style={styles.row}>
        <Icon name="payment" size={16} color={Colors.text} />
        <CustomText variant="h8">Payment</CustomText>
      </View>
      <View style={styles.rows}>
        <CustomText variant="h8">
          {order?.paymentType || 'N/A'}
        </CustomText>
      </View>

      <View style={styles.row}>
        <Icon name="location-on" size={16} color={Colors.text} />
        <CustomText variant="h8">Deliver to</CustomText>
      </View>
      <View style={styles.rows}>
        <CustomText variant="h8">
          {(order.deliveryLocation.fullAddress) ||
            'N/A'}
        </CustomText>
      </View>

      <View style={styles.row}>
        <Icon name="access-time" size={16} color={Colors.text} />
        <CustomText variant="h8">Order placed</CustomText>
      </View>
      <View style={styles.rows}>
        <CustomText variant="h8">
      {order?.createdAt ? formatOrderDate(order.createdAt, true, true) : 'N/A'}

        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#fff',
  },
  heading: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 3,
  },
});

export default OrderDetails;
