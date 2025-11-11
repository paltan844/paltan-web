import {View, StyleSheet, Image} from 'react-native';
import  React, { FC }  from 'react';
import { useCartStore } from '@state/cartStore';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import OrderItem from './OrderItem';

const OrderList:FC = () => {
const cartItems = useCartStore((state)=>state.cart);
const totalItems = cartItems?.reduce((acc,cart)=>acc + cart?.count,0);

        return (
            <View style={styles.container}>
                  <View style={styles.flexRow}>
                  <View style={styles.imgContainer}>
                    <Image source={require('@assets/icons/clock.png')} style={styles.img}/>
                    </View>
                    <View>
                    <CustomText fontFamily={Fonts.SemiBold} variant="h5"> Same Day Delivery</CustomText>
             <CustomText fontFamily={Fonts.SemiBold} variant="h8" style={{opacity:0.5}}> Shipment of {totalItems || 0} item </CustomText>
                </View>
                </View>
{cartItems?.map((item)=>{
    return(
        <OrderItem key={item._id} item={item}/>
    );
})}
            </View>
    );
};

const styles = StyleSheet.create({
    container:{
        borderRadius:15,
        marginBottom:10,
        backgroundColor:'#fff',
    },
    imgContainer:{
        backgroundColor: Colors.backgroundSecondary,
        padding:10,
        borderRadius:15,
    },
    flexRow:{
alignItems:'center',
flexDirection:'row',
gap:12,
paddingHorizontal:10,
paddingVertical:12,
    },
    img:{
       width:30,
       height:30,
    },
});

export default OrderList;
