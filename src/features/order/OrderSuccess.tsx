import {View, StyleSheet} from 'react-native';
import  React, { FC, useEffect }  from 'react';
import { screenWidth } from '@utils/Scaling';
import { Colors, Fonts } from '@utils/Constants';
import LottieView from 'lottie-react-native';
import CustomText from '@components/ui/CustomText';
import { useAuthStore } from '@state/authStore';
import { replace } from '@utils/NavigationUtils';
import { cleanAddress } from '@utils/CleanAddress';
import { formatSelectedLocation } from '@utils/AddressPreview';

const OrderSuccess:FC = () => {
const {user} = useAuthStore();
useEffect(()=>{
const timeoutId = setTimeout(()=>{
replace('LiveTracking');
},1200);
return ()=>clearTimeout(timeoutId);
},[]);
        return (
            <View style={styles.Container}>
                <LottieView
                source={require('@assets/animations/confirm.json')}
             autoPlay
             duration={1000}
             loop={false}
             speed={1}
             style={styles.lottieView}
             enableMergePathsAndroidForKitKatAndAbove
             hardwareAccelerationAndroid
             />
                <CustomText fontFamily={Fonts.SemiBold} style={styles.orderPlaceText} variant="h8">
                    ORDER PLACED
                </CustomText>
                <View style={styles.deliveryContainer}>
                    <CustomText fontFamily={Fonts.SemiBold} style={styles.deliveryText} variant="h4">Delivering to Home</CustomText>
                </View>

                    <CustomText fontFamily={Fonts.Medium} style={styles.addressText} variant="h8">{cleanAddress(formatSelectedLocation(user?.address)) || 'somewhere,knowhere😃'}</CustomText>
            </View>
    );
};

const styles = StyleSheet.create({
    Container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    deliveryContainer:{
        paddingBottom:4,
        borderBottomWidth:2,
        marginBottom:4,
        borderColor:Colors.secondary,
    },
    lottieView:{
       width:screenWidth * 0.6,
       height:150,
    },
    orderPlaceText:{
        opacity:0.4,
    },
    deliveryText:{
        marginTop:15,
        borderColor:Colors.secondary,
    },
    addressText:{
        opacity:0.8,
        textAlign:'center',
        width:'80%',
        marginTop:10,
    },
});

export default OrderSuccess;
