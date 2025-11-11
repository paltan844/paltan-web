import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { formatOrderDate } from '@utils/DateUtils';

interface CartItem {
  _id: string | number;
  item: any;
  count: number;
}

interface Order {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'delivered' | 'available' | 'arriving';
}

const statusColors: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: '#FFF8E1', text: '#FFA000' },
  delivered: { bg: '#E8F5E9', text: '#4CAF50' },
  cancelled: { bg: '#FFEBEE', text: '#D32F2F' },
  available: { bg: '#FFF3E0', text: '#FB8C00' },
  arriving: { bg: '#E3F2FD', text: '#1E88E5' },
};

const OrderItem: FC<{ item: Order; index: number; onPress?: () => void }> = ({ item, index, onPress }) => {
  const { orderId, items, totalPrice, createdAt, status } = item;

  const colors = statusColors[status] || { bg: '#F5F5F5', text: '#757575' };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalPrice);

  const isTouchable = status === 'delivered';

  const Wrapper = isTouchable ? TouchableOpacity : View;
  const wrapperProps = isTouchable ? { onPress } : {};

  return (
    <Wrapper style={[styles.card, { backgroundColor: colors.bg }]} {...wrapperProps}>
      <View style={styles.rowBetween}>
        <CustomText variant="h9" fontFamily={Fonts.Medium}>
          #{orderId}
        </CustomText>

        <View style={[styles.statusTag, { borderColor: colors.text }]}>
          <CustomText
            variant="h9"
            fontFamily={Fonts.Medium}
            style={{ color: colors.text, textTransform: 'capitalize' }}
          >
            {status}
          </CustomText>
        </View>
      </View>

      <View style={[styles.rowBetween, { marginTop: 10 }]}>
        <View style={{ width: '55%' }}>
          {items.map(({ item: product, count }, idx) => {
            if (!product) {return null;}

            const price = parseFloat(product?.discountprice) > 0
              ? parseFloat(product?.discountprice)
              : parseFloat(product?.price);

            return (
              <View key={idx} style={styles.backItem}>
                <CustomText
                  variant="h9"
                  fontFamily={Fonts.Medium}
                  numberOfLines={2}
                >
                  {count}x {product?.name || 'Unnamed Product'} : {count} x ₹
                  {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(price)}
                </CustomText>
              </View>
            );
          })}
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <CustomText
            variant="h5"
            fontFamily={Fonts.SemiBold}
            style={{ marginBottom: 4 }}
          >
            {formattedPrice}
          </CustomText>
          <CustomText variant="h8" style={{ opacity: 0.7 }}>
            {formatOrderDate(createdAt, false, false)}
          </CustomText>
        </View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  backItem: {
    backgroundColor: 'rgba(212, 178, 178, 0.16)',
    borderRadius: 8,
    padding: 6,
    paddingRight: 1,
    marginBottom: 4,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});

export default OrderItem;
