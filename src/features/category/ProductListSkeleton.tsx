import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window');

// laptop screen
const isLaptop = width >= 1024;

const ProductListSkeleton = ({ dummyData = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] }) => {

  const renderSkeletonCard = () => (
    <View style={[styles.card, { width: isLaptop ? '23%' : '48%' }]}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.textPlaceholder} />
      <View style={[styles.textPlaceholder, { width: '50%' }]} />
    </View>
  );

  return (
    <FlatList
      data={dummyData}
      numColumns={isLaptop ? 4 : 2}  
      key={isLaptop ? '4' : '2'}     
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