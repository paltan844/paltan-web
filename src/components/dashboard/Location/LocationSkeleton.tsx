import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const LocationSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.line, styles.lineFull, { opacity: shimmerOpacity }]} />
      <Animated.View style={[styles.line, styles.lineMedium, { opacity: shimmerOpacity }]} />
      <Animated.View style={[styles.line, styles.lineShort, { opacity: shimmerOpacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  line: {
    height: 18,
    backgroundColor: '#e2e2e2',
    borderRadius: 10,
    marginBottom: 10,
  },
  lineFull: {
    width: width * 0.85,
  },
  lineMedium: {
    width: width * 0.65,
  },
  lineShort: {
    width: width * 0.4,
  },
});

export default LocationSkeleton;
