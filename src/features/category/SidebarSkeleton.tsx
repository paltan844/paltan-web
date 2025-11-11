import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

const SidebarSkeleton = () => {
  const placeholderCount = 6;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#f2f2f2'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.sideBar}>
        <Animated.View style={[styles.arrowButton, { backgroundColor }]} />

        <View style={styles.scrollContainer}>
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <View
              key={index}
              style={[styles.categoryButton, { width: ITEM_WIDTH }]}
            >
              <Animated.View style={[styles.imageContainer, { backgroundColor }]} />
              <Animated.View style={[styles.textLine, { backgroundColor }]} />
            </View>
          ))}
        </View>

        <Animated.View style={[styles.arrowButton, { backgroundColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 79,
  },
  sideBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    width: '100%',
    backgroundColor: 'rgba(193, 208, 200, 0.5)',
    borderBottomWidth: 0.8,
    borderBottomColor: '#eee',
  },
  arrowButton: {
    width: RFValue(25),
    height: RFValue(25),
    borderRadius: RFValue(5),
    marginHorizontal: 5,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryButton: {
    padding: 10,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '55%',
    height: '70%',
    borderRadius: 10,
    marginBottom: 5,
  },
  textLine: {
    width: '70%',
    height: 8,
    borderRadius: 4,
  },
});

export default SidebarSkeleton;
