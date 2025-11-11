import {View, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import  React, { FC, useEffect }  from 'react';
import { useAuthStore } from '@state/authStore';
import { getOrderById } from '@service/orderService';
import { Colors, Fonts } from '@utils/Constants';
import LiveHeader from './LiveHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import DeliveryDetails from './DeliveryDetails';
import OrderSummary from './OrderSummary';
import withLiveStatus from './withLiveStatus';
import LiveMap from './LiveMap';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { useFocusEffect } from '@react-navigation/native';

const LiveTracking:FC = () => {
const {currentOrder, setCurrentOrder} = useAuthStore();
const fetchOrderDetails = async()=>{
    const data = await getOrderById(currentOrder?._id as any);
    setCurrentOrder(data);
};


useEffect(()=>{
    fetchOrderDetails();
},[]);


let msg = 'Packing your order';
let time = 'Arriving same day';
if(currentOrder ?.status === 'confirmed'){
    msg = 'Arriving Soon';
    time = 'Arriving in minutes';

}else if(currentOrder ?.status === 'arriving'){
    msg = 'Arriving Soon';
    time = 'Arriving in minutes';

}else if(currentOrder ?.status === 'delivered'){
    msg = 'Order Delivered';
    time = 'Fatest Delivery ⚡';

}

useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      resetAndNavigate('MainTabs');
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [])
);


        return (
            <View style={styles.Container}>
                <LiveHeader type="customer" title={msg} secondTitle={time}/>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

<LiveMap
deliveryLocation={currentOrder?.deliveryLocation}
deliveryPersonLocation={currentOrder?.deliveryPersonLocation}
pickupLocation={currentOrder?.pickupLocation}
hasAccepted={currentOrder?.status === 'confirmed'}
hasPickedUp={currentOrder?.status === 'arriving'}
/>

    <View style={styles.flexRow}>
      <View style={styles.iconContainer}>
       <Icon name={currentOrder?.deliveryPartner ? 'phone' : 'shopping'} color={Colors.disabled}
       size={RFValue(20)}/>
       </View>
      <View style={{width:'82%'}}>

       <CustomText numberOfLines={1} variant="h7" fontFamily={Fonts.SemiBold}>
        {currentOrder?.deliveryPartner?.name || 'We will soon assign delivery partner'}
        </CustomText>

       {currentOrder?.deliveryPartner &&
       <CustomText variant="h7" fontFamily={Fonts.Medium}>
        {currentOrder?.deliveryPartner?.phone}
        </CustomText>}

       <CustomText variant="h9" fontFamily={Fonts.Medium}>
        {currentOrder?.deliveryPartner ? 'For Delivery Instructions you can contact here' : msg}
        </CustomText>
        </View>
       </View>

       {(currentOrder?.status !== 'arriving' || currentOrder?.status !== 'delivered' || currentOrder?.status === 'confirmed') && (
  <View style={[styles.flexRow, { backgroundColor: 'rgba(100,100,100,0.04)', padding: 12, borderRadius: 12, alignItems: 'center', marginVertical: 8 }]}>
  <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '20', borderRadius: 20, padding: 8 }]}>
    <Icon name="map-marker" color='green' size={RFValue(20)} />
  </View>
    <View style={{ width: '82%' }}>
    <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
        Change Address or Receiver Details
      </CustomText>
      <CustomText variant="h9" fontFamily={Fonts.Medium} style={{ color: '#555', marginTop: 2 }}>
        You can update before your order is dispatched.
      </CustomText>
      <TouchableOpacity
          activeOpacity={0.7}>
      <CustomText
        variant="h8"
        style={{ color:'green', marginTop: 5 }}
      >
        Change Address
      </CustomText>
      </TouchableOpacity>
    </View>
  </View>
)}


<DeliveryDetails details={currentOrder?.deliveryLocation}/>

<OrderSummary order={currentOrder}/>




<CustomText variant="h6" fontFamily={Fonts.SemiBold} style={{opacity:0.6, marginTop:20}}>
      Powered By Paltan
     </CustomText>

          </ScrollView>
            </View>
    );
};

const styles = StyleSheet.create({
    Container:{
        flex:1,
        backgroundColor:Colors.secondary,
    },
    scrollContent:{
        paddingBottom:150,
        padding:15,
        backgroundColor:Colors.backgroundSecondary,
    },
        flexRow:{
            marginTop:15,
            backgroundColor:'#fff',
            paddingVertical:10,
            padding:10,
            width:'100%',
            borderRadius:15,
           borderColor:Colors.border,
            flexDirection:'row',
            alignItems:'center',
            gap:10,
            borderBottomWidth:0.7,
        },
        iconContainer:{
            borderRadius:100,
            borderColor:Colors.border,
             alignItems:'center',
             padding:10,
        backgroundColor:Colors.backgroundSecondary,
        },
});

export default withLiveStatus(LiveTracking);
