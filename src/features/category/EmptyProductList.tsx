import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const EmptyProductList = () => {
  const translateY = useSharedValue(20);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    translateY.value = withSpring(0, { damping: 7, stiffness: 80 });
    scale.value = withSpring(1, { damping: 6, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: 0.85,
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, animatedStyle]}>
        Nothing Here!
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft:5,
    marginTop: '50%',
    justifyContent: 'center', // ✅ centers vertically
    alignItems: 'center',     // ✅ centers horizontally
    backgroundColor: 'transparent', // optional
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#777',
    textAlign: 'center',
  },
});

export default EmptyProductList;
