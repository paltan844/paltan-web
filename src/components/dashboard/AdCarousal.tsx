import React, { FC } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { screenWidth } from '@utils/Scaling';
import ScalePress from '@components/ui/ScalePress';

interface AdCarouselProps {
  adData: string[];
}

const AdCarousel: FC<AdCarouselProps> = ({ adData }) => {
  const progressValue = useSharedValue(0);

  return (
    <View style={styles.container}>
      <Carousel
        loop
        autoPlay={true}
       // autoPlayInterval={3000}
        width={screenWidth}
        height={screenWidth * 0.17}
        data={adData}
        mode="parallax"
        pagingEnabled
        snapEnabled
        modeConfig={{
          parallaxScrollingOffset: 50,
          parallaxScrollingScale: 0.94,
        }}
        scrollAnimationDuration={1000}
        renderItem={({ item }: any) => (
          <ScalePress style={styles.imageContainer}>
            <Image
              source={typeof item === 'string' ? { uri: item } : item}
              style={styles.image}
            />
          </ScalePress>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
});

export default AdCarousel;
