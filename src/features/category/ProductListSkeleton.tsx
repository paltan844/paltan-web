import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';

const ProductListSkeleton = ({ dummyData = [1, 2, 3, 4, 5, 6,7,8,9,10] }) => {

  const renderSkeletonCard = () => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.textPlaceholder} />
      <View style={[styles.textPlaceholder, { width: '50%' }]} />
    </View>
  );

  return (
    <FlatList
      data={dummyData}
      numColumns={2}
      keyExtractor={(item) => item.toString()}
      renderItem={renderSkeletonCard}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 4,
  },
  card: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 5,
  },
  imagePlaceholder: {
    height: 97,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 7,
  },
  textPlaceholder: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
  },
});

export default ProductListSkeleton;
