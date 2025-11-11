import React from 'react';
import { View, StyleSheet } from 'react-native';

const OrderListSkeleton = () => {
  return (
    <View>
      {[...Array(7)].map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={[styles.skeletonBox, { width: 120, height: 14 }]} />
            <View style={[styles.statusTag, styles.skeletonBox, { width: 60, height: 14 }]} />
          </View>

          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <View style={{ width: '55%' }}>
              {[...Array(2)].map((_, i) => (
                <View key={i} style={[styles.backItem, styles.skeletonBox, { height: 12, marginBottom: 6 }]} />
              ))}
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <View style={[styles.skeletonBox, { width: 60, height: 16, marginBottom: 4 }]} />
              <View style={[styles.skeletonBox, { width: 80, height: 12 }]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonBox: {
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  backItem: {
    borderRadius: 8,
  },
  statusTag: {
    borderRadius: 12,
  },
});

export default OrderListSkeleton;
