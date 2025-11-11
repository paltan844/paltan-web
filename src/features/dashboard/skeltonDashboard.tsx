import React, { FC, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonDashboard: FC<SkeletonProps> = ({ width = 200, height = 20, borderRadius = 8, style }) => {
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const animate = () => {
      translateX.setValue(-1);
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, [translateX]);

  const shimmerStyle = {
    transform: [
      {
        translateX: translateX.interpolate({
          inputRange: [-1, 1],
          outputRange: [-200, 200],
        }),
      },
    ],
  };

  return (
    <View style={[{ width: width, height, borderRadius, backgroundColor: '#E1E9EE', overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, width: 200 }}
        />
      </Animated.View>
    </View>
  );
};

export default SkeletonDashboard;
