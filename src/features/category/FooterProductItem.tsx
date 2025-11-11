import {View, StyleSheet, Image} from 'react-native';
import  React, { FC }  from 'react';
import { screenHeight } from '@utils/Scaling';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '@utils/Constants';
import UniversalAdd from '@components/ui/UniversalAdd';

const FooterProductItem:FC<{item: any; index: number}> = ({index,item}) => {

const isSecondColoumn = index % 2 !== 0;

        return (
            <View style={[styles.container,{marginRight: isSecondColoumn ? 10 : 0}]}>
                <View style={styles.imagecontainer}>
<Image source={{uri:item.image}} style={styles.image}/>
                </View>
                <View style={styles.content}>
                <View style={styles.flexRow}>
<Image source={require('@assets/icons/clock.png')} style={styles.clockIcon}/>
              <CustomText fontSize={RFValue(6)} fontFamily={Fonts.Medium}>IN MINS</CustomText>
                </View>

                <CustomText
                fontFamily={Fonts.Medium}
                variant="h8" numberOfLines={2} style={{marginVertical:4 }}
                >
                    {item.name}  ({item?.quantity})
                </CustomText>

              <View style={styles.priceContainer}>
                <View>
                <CustomText fontFamily={Fonts.Medium} variant="h7">
                ₹{item?.discountPrice}
             </CustomText>
             <CustomText fontFamily={Fonts.Medium} variant="h8" style={{opacity:0.8,textDecorationLine:'line-through'}}>
             ₹{item?.price}
             </CustomText>
                </View>
                <UniversalAdd item={item}/>
            </View>
            </View>
            </View>


    );
};

const styles = StyleSheet.create({
    container:{
        width:'45%',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom:10,
        marginLeft: 10,
        overflow: 'hidden',
    },
   imagecontainer:{
        width:'100%',
        height:screenHeight * 0.14,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:5,

    },
    image:{
        width:'100%',
        height:'100%',
        aspectRatio:1 / 1,
        resizeMode:'contain',
    },
    flexRow:{
        flexDirection:'row',
        borderRadius:4,
        alignItems:'center',
        padding:2,
        alignSelf:'flex-start',
        backgroundColor:Colors.backgroundSecondary,
    },
    clockIcon:{
        height:15,
        width:15,
    },
    content:{
        flex:1,
        paddingHorizontal:10,
    },
    priceContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:6,
        marginTop:'auto',
    },

});

export default FooterProductItem;
