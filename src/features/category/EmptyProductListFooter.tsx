import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const EmptyProductListFooter = () => {
    const translateY = useSharedValue(20);
    const scale = useSharedValue(1);

    React.useEffect(() => {
        translateY.value = withSpring(0, { damping: 7, stiffness: 80 });
        scale.value = withSpring(1, { damping: 6, stiffness: 100 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        opacity: 0.7,
    }));

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.text, animatedStyle]}>
                No Product Found
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedContainer: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom:0,
    },
    text: {
        paddingTop:0,
        justifyContent:'center',
        alignItems:'center',
        width: 190,
        height: 30,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#777',
    },
});

export default EmptyProductListFooter;
