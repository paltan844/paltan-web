import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isLaptop = width >= 1024;

const OrderListSkeleton = () => {
  return (
    <View style={styles.container}>
      {[...Array(7)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.card,
            { width: isLaptop ? '30%' : '100%' } // width fix
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={[styles.skeletonBox, { width: 120, height: 14 }]} />
            <View style={[styles.statusTag, styles.skeletonBox, { width: 60, height: 14 }]} />
          </View>

          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <View style={{ width: '55%' }}>
              {[...Array(2)].map((_, i) => (
                <View
                  key={i}
                  style={[styles.backItem, styles.skeletonBox, { height: 12, marginBottom: 6 }]}
                />
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
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
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