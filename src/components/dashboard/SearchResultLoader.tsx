import React, { FC } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingIndicatorProps {
  loading: boolean;
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ loading }) => {
  if (!loading) {return null;}

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0057D9" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default LoadingIndicator;
