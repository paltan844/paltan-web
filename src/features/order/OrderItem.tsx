import {View,StyleSheet, Image} from 'react-native';
import  React, { FC }  from 'react';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import UniversalAdd from '@components/ui/UniversalAdd';

const OrderItem:FC<{item:any}> = ({item}) => {

        return (
                              <View style={styles.flexRow}>
                              <View style={styles.imgContainer}>
                                <Image source={{uri:item?.item?.image}} style={styles.img}/>
                                 </View>
                                  <View style={{width:'55%'}}>
                <CustomText
                fontFamily={Fonts.Medium} variant="h8" numberOfLines={2}>
                {item.item.name}
                </CustomText>
                <CustomText  variant="h9">
                {item.item.quantity}
                </CustomText>
               </View>
               <View style={{paddingTop:15 ,width:'20%',alignItems:'flex-end'}}>
<UniversalAdd item={item.item}/>
 <CustomText
          fontFamily={Fonts.Medium}
          variant="h8"
          style={{ alignSelf: 'flex-end', marginTop: 4 }}
        >
  ₹{item.count * (item.item.discountprice > 0
    ? item.item.discountprice
    : parseFloat(item.item.price))}
</CustomText>
               </View>
               </View>
    );
};

const styles = StyleSheet.create({
    imgContainer:{
        backgroundColor: Colors.backgroundSecondary,
        padding:5,
        borderRadius:10,
        width:'15%',
    },
    flexRow:{
alignItems:'center',
flexDirection:'row',
gap:12,
paddingHorizontal:10,
paddingVertical:12,
borderTopWidth:0.6,
borderTopColor:Colors.border,
    },
    img:{
       width:33,
       height:33,
    },
});

export default OrderItem;
