import {View, StyleSheet, Image} from 'react-native';
import  React, { FC }  from 'react';
import { Colors, Fonts } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import BillDetails from '@features/order/BillDetails';
import OrderDetails from '@features/order/orderDetails';
import { calculatePriceSummary } from '@utils/priceUtils';

const OrderSummary:FC<{order:any}> = ({order}) => {
  const { totalMRP, totalDiscountPrice, productDiscount } = calculatePriceSummary(order?.items || []);
        return (
          <>
            <View style={styles.container}>
            <View style={styles.flexRow}>
            <View style={styles.iconContainer}>
   <Icon name="shopping-outline" color={Colors.disabled} size={RFValue(20)}/>
   </View>
   <View>
<CustomText variant="h7" fontFamily={Fonts.SemiBold}>
 Order summary
 </CustomText>
 <CustomText variant="h9" fontFamily={Fonts.Medium}>
 Order ID -#{order?.orderId}
 </CustomText>
 </View>
   </View>
{order?.items?.map((item: any, index: number) => {
  const product = item?.item;
  if (!product) {return null;}

  return (
    <View style={styles.flexRow} key={index}>
      <View style={styles.imgContainer}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.img} />
        ) : (
          <Icon name="image-off-outline" size={30} color={Colors.border} />
        )}
      </View>

      <View style={{ width: '55%' }}>
        <CustomText numberOfLines={2} variant="h8" fontFamily={Fonts.Medium}>
          {product.name || 'Unnamed Product'}
        </CustomText>
        <CustomText variant="h9">
          {product.quantity || '—'}
        </CustomText>
      </View>

      <View style={{ width: '20%', alignItems: 'flex-end' }}>
     <View style={{ flexDirection: 'row', gap: 5, marginTop: 4 }}>
  {parseFloat(item.item.discountprice) > 0 ? (
    <>
      <CustomText
        variant="h8"
        fontFamily={Fonts.Medium}
        style={{ textDecorationLine: 'line-through', color: Colors.gray }}
      >
        ₹{parseFloat(item.item.price) * item.count}
      </CustomText>

      <CustomText
        variant="h8"
        fontFamily={Fonts.Medium}
        style={{ color: 'black' }}
      >
        ₹{parseFloat(item.item.discountprice) * item.count}
      </CustomText>
    </>
  ) : (
    <CustomText variant="h8" fontFamily={Fonts.Medium}>
      ₹{parseFloat(item.item.price) * item.count}
    </CustomText>
  )}
</View>

      <CustomText variant="h8" fontFamily={Fonts.Medium} style={{ marginTop: 4 }}>
          {item.count}x
        </CustomText>
      </View>
    </View>
  );
})}

<BillDetails
  totalItemPrice={totalDiscountPrice}
  totalMRP={totalMRP}
  productDiscount={productDiscount}
/>

  </View>
  <OrderDetails  order={order}/>
</>
    );
};

const styles = StyleSheet.create({
  imgContainer:{
    backgroundColor:Colors.backgroundSecondary,
    padding:10,
    width:'17%',
    borderRadius:15,
},
img:{
  width:40,
  height:40,
},
  container:{
                        width:'100%',
                        paddingVertical:10,
                        backgroundColor:'#fff',
                        marginVertical:15,
                        borderRadius:15,
        },
        flexRow:{
             flexDirection:'row',
            alignItems:'center',
            gap:10,
            padding:10,
           borderColor:Colors.border,
           borderBottomWidth:0.7,
        },
        iconContainer:{
            justifyContent:'center',
           alignItems:'center',
           padding:10,
          backgroundColor:Colors.backgroundSecondary,
          borderRadius:100,
        },
});

export default OrderSummary;
