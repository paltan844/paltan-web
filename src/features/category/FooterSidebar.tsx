import React, { useEffect, useRef } from "react";

interface FooterSidebarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const FooterSidebar: React.FC<FooterSidebarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedCategory?._id || !listRef.current) return;

    const container = listRef.current;
    const activeItem = container.querySelector(
      `[data-id="${selectedCategory._id}"]`
    ) as HTMLElement;

    if (activeItem) {
      const itemTop = activeItem.offsetTop;
      const itemBottom = itemTop + activeItem.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (itemTop < containerTop || itemBottom > containerBottom) {
        container.scrollTo({
          top: itemTop - container.clientHeight / 2 + activeItem.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [selectedCategory]);

  return (
    <div
      ref={listRef}
      style={{
        width: "85px",
        position: "fixed",
        top: "60px",
        left: 0,
        bottom: 0,
        background: "rgba(193, 208, 200, 0.45)",
        borderRight: "1px solid #e5e5e5",
        overflowY: "auto",
        padding: "4px 0 60px 0",
        scrollBehavior: "smooth",
        zIndex: 100,
        transform: "translateZ(0)", // prevents flicker
        willChange: "transform",
      }}
    >
      {categories.map((category) => {
        const isActive =
          selectedCategory?._id === category?._id ||
          selectedCategory?.id === category?._id;

        return (
          <div
            key={category._id || category.id}
            data-id={category._id}
            onClick={() => onCategoryPress(category)}
            style={{
              cursor: "pointer",
              padding: "8px 6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "#EAFBEF" : "transparent",
              borderLeft: isActive
                ? "4px solid #6b8e23"
                : "4px solid transparent",
              transition: "all 0.25s ease",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: isActive ? "#d9f0e6" : "#f7f7f7",
                border: isActive ? "1.5px solid #6b8e23" : "1px solid #ddd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                marginBottom: 5,
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: "65%",
                  height: "65%",
                  objectFit: "contain",
                  userSelect: "none",
                }}
              />
            </div>

            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#222",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "13px",
                height: "26px",
                width: "100%",
                margin: 0,
                padding: "0 2px",
                textAlign: "center",
              }}
            >
              {category.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FooterSidebar;



{/*
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { useCartStore } from '@state/cartStore';

interface FooterSidebarProps {
    selectedCategory: any;
    categories: any;
    onCategoryPress: (category: any) => void;
}


const FooterSidebar: FC<FooterSidebarProps> = ({ selectedCategory, categories, onCategoryPress }) => {
    const ScrollViewRef = useRef<ScrollView>(null);
   const indicatorPosition = useSharedValue(0);
   const animatedValues = categories?.map(() => useSharedValue(0));
  const cart = useCartStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.count, 0);


    useEffect(() => {
        let targetIndex = -1;
        categories?.forEach((category: any, index: number) => {
            const isSelected = selectedCategory?._id === category?._id;
            animatedValues[index].value = withTiming(isSelected ? 2 : -15, { duration: 500 });
            if (isSelected) {targetIndex = index;}
        });

         if (targetIndex !== -1) {

indicatorPosition.value = withTiming(targetIndex * 100 - 9, { duration: 500 });


                    runOnJS(() => {
                        ScrollViewRef.current?.scrollTo({
                            y: targetIndex * 100,
                            animated: true,
                        });
                    });
                }
            }, [selectedCategory]);

 const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: indicatorPosition.value }],
    }));


    return (
            <View style={styles.sideBar}>
<ScrollView
    ref={ScrollViewRef}
    contentContainerStyle={{ paddingBottom: 50 }}
    showsVerticalScrollIndicator={false}
     style={ cartCount > 0 && { marginBottom: 20 }}
    >
        <Animated.View style={[styles.indicator, indicatorStyle]} />
                    <Animated.View>
                    {categories?.map((category: any, index: number) => {
         const animatedStyle = useAnimatedStyle(() => ({
            bottom: animatedValues[index].value,
         }));

                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                style={styles.categoryButton}
                                onPress={() => onCategoryPress(category)}>
                                <View
                                    style={[
                                        styles.imageContainer ,
                                       selectedCategory?.id === category?._id && styles.selectedImageContainer]
                                    }>
                                    <Animated.Image
                                        source={{ uri: category.image }}
                                          style={[styles.image, animatedStyle]}
                                    />
                                </View>
                                <CustomText
                                    fontSize={RFValue(7)}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                    style={{textAlign: 'center'}}>
                                    {category?.name}
                                </CustomText>
                            </TouchableOpacity>
                        );
                    })}
                    </Animated.View>
                </ScrollView>
                </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 79,
    },
    sideBar: {
        width: '24%',
        position: 'relative',
        backgroundColor: 'rgba(185, 225, 206, 0.5)',
        borderRightWidth: 0.8,
        borderRightColor: '#eee',
    },
    categoryContainer: {
        flexDirection: 'row',
    },
    categoryButton: {
        width:'100%',
         paddingVertical: 0,
        padding: 10,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    imageContainer: {
        borderRadius: 100,
        height: '50%',
        marginBottom: 10,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F7',
        overflow: 'hidden',
    },
    selectedImageContainer: {
        backgroundColor: '#CCFFDB',
    },
    indicator: {
        backgroundColor: 'black',
        position: 'absolute',
        top: 10,
        right:0,
        height: 80,
        width: 4,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
       alignSelf:'center',
    },
    categoryText: {
        textAlign: 'center',
    },
    content: {
        flex: 1,
        marginTop: 120,
        backgroundColor: '#f7f7f7',
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

export default FooterSidebar;    */}
