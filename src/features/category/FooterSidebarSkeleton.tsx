import { View, StyleSheet, ScrollView } from 'react-native';
import React, { FC } from 'react';

const FooterSidebarSkeleton: FC = () => {
  const dummyItems = Array(8).fill(0);

  return (
    <View style={styles.sideBar}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        {dummyItems.map((_, index) => (
          <View key={index} style={styles.categoryButton}>
            <View style={styles.imageSkeleton} />
            <View style={styles.textSkeleton} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sideBar: {
    width: '24%',
    backgroundColor: 'rgba(185, 225, 206, 0.5)',
    borderRightWidth: 0.8,
    borderRightColor: '#eee',
  },
  categoryButton: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  imageSkeleton: {
    width: '75%',
    height: '50%',
    borderRadius: 100,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  textSkeleton: {
    width: '60%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
});

export default FooterSidebarSkeleton;
