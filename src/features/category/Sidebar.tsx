import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

interface SidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const Sidebar: FC<SidebarProps> = ({ selectedCategory, categories, onCategoryPress }) => {
  const ScrollViewRef = useRef<ScrollView>(null);
  const indicatorPosition = useSharedValue(0);
  const animatedValues = categories.map(() => useSharedValue(10));
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    let targetIndex = -1;
    categories.forEach((category, index) => {
      const isSelected = selectedCategory?._id === category?._id;
      animatedValues[index].value = withTiming(isSelected ? 20 : 10, { duration: 500 });

      if (isSelected) {
        setTimeout(() => {
          animatedValues[index].value = withTiming(0, { duration: 300 });
        }, 500);
      }

      if (isSelected) {
        targetIndex = index;
      }
    });

    if (targetIndex !== -1) {
      const indicatorPositionX = targetIndex * ITEM_WIDTH + (120 - 70) / 2;
      indicatorPosition.value = withTiming(indicatorPositionX, { duration: 500 });
      runOnJS(() => {
        ScrollViewRef.current?.scrollTo({
          x: targetIndex * ITEM_WIDTH,
          animated: true,
        });
      });
    }
  }, [selectedCategory]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  const scrollLeft = () => {
    ScrollViewRef.current?.scrollTo({
      x: Math.max(scrollX - ITEM_WIDTH * 3, 0),
      animated: true,
    });
  };

  const scrollRight = () => {
    const maxScroll = categories.length * ITEM_WIDTH - width;
    ScrollViewRef.current?.scrollTo({
      x: Math.min(scrollX + ITEM_WIDTH * 3, maxScroll),
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.sideBar}>
        {categories.length > 0 && (
          <TouchableOpacity style={styles.leftButton} onPress={scrollLeft}>
            <Icon name="arrow-left" color={Colors.text} size={RFValue(20)} />
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ScrollView
            ref={ScrollViewRef}
            horizontal
            contentContainerStyle={styles.categoryContainer}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            onScroll={(event) => {
              setScrollX(event.nativeEvent.contentOffset.x);
            }}
          >
            <Animated.View style={[styles.indicator, indicatorStyle]} />
            {categories.map((category, index) => {
              const animatedStyle = useAnimatedStyle(() => ({
                transform: [
                  { translateY: animatedValues[index].value },
                  { scale: animatedValues[index].value === 0 ? 1 : 1.1 },
                ],
              }));

              return (
                <TouchableOpacity
                  key={category._id || index}
                  activeOpacity={1}
                  style={[styles.categoryButton, { width: ITEM_WIDTH }]}
                  onPress={() => onCategoryPress(category)}
                >
                  <View
                    style={[
                      styles.imageContainer,
                      selectedCategory?._id === category?._id && styles.selectedImageContainer,
                    ]}
                  >
                    <Animated.Image
                      source={{ uri: category.image }}
                      style={[styles.image, animatedStyle]}
                    />
                  </View>

                  <CustomText
                    fontSize={RFValue(7)}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.categoryText}
                  >
                    {String(category?.name || '')}
                  </CustomText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {categories.length > 0 && (
          <TouchableOpacity style={styles.rightButton} onPress={scrollRight}>
            <Icon name="arrow-right" color={Colors.text} size={RFValue(20)} />
          </TouchableOpacity>
        )}
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
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(193, 208, 200, 0.5)',
    borderBottomWidth: 0.8,
    borderBottomColor: '#eee',
    zIndex: 10,
    paddingHorizontal: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    padding: 10,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  imageContainer: {
    marginTop: 1,
    borderRadius: 10,
    height: '70%',
    marginBottom: 1,
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F7',
    overflow: 'hidden',
  },
  selectedImageContainer: {
    backgroundColor: '#929b6b42',
  },
  indicator: {
    marginLeft: 9,
    backgroundColor: 'black',
    position: 'absolute',
    top: 1,
    height: 3,
    width: 70,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  categoryText: {
    textAlign: 'center',
  },
  leftButton: {
    position: 'absolute',
    left: 1,
    top: '60%',
    transform: [{ translateY: -25 }],
    zIndex: 15,
  },
  rightButton: {
    position: 'absolute',
    right: 1,
    top: '60%',
    transform: [{ translateY: -25 }],
    zIndex: 15,
  },
});

export default Sidebar;
