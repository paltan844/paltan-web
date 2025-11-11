import React from 'react';
import { View, StyleSheet } from 'react-native';

const CategoryListSkeleton = () => {
  const dummyArray = Array(12).fill(0);

  return (
    <View style={styles.container}>
      {dummyArray.map((_, index) => (
        <View key={index} style={styles.cardWrapper}>
          <View style={styles.card}>
            <View style={styles.iconSkeleton} />
            <View style={styles.textSkeleton} />
            <View style={styles.chevronSkeleton} />
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
  cardWrapper: {
    width: '48%',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    height: 120,
    justifyContent: 'space-between',
  },
  iconSkeleton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#bbb',
    alignSelf: 'center',
  },
  textSkeleton: {
    height: 12,
    width: '60%',
    backgroundColor: '#bbb',
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 10,
  },
  chevronSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#bbb',
    alignSelf: 'flex-end',
  },
});

export default CategoryListSkeleton;
