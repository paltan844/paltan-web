import {View, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import  React, { FC }  from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigate } from '@utils/NavigationUtils';
import { useAuthStore } from '@state/authStore';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';

const LiveHeader:FC<{
    title: string;
    type:'customer'| 'Delivery';
    secondTitle:string
}> = ({
    title,
    type,
    secondTitle,
}) => {
const isCustomer = type === 'customer';
const {currentOrder, setCurrentOrder} = useAuthStore();
        return (
            <SafeAreaView>
                <View style={styles.headerContainer}>
<Pressable style={styles.backButton} onPress={()=>{
    if(isCustomer){
        navigate('MainTabs');
        if(currentOrder?.status === 'delivered'){
            setCurrentOrder(null);
        }
        return;
    }
    navigate('DeliveryDashboard');
}}>
    <Icon name="chevron-back" color={isCustomer ? '#fff' : '#000'} size={RFValue(16)}/>
</Pressable>
<CustomText variant="h8" fontFamily={Fonts.Medium}
style={isCustomer ? styles.titleTextWhite : styles.titleTextBlack}
>
    {title}
</CustomText>
<CustomText variant="h4" fontFamily={Fonts.SemiBold}
style={isCustomer ? styles.titleTextWhite : styles.titleTextBlack}
>
    {secondTitle}
</CustomText>
                </View>
                </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer:{
        paddingVertical:10,
        alignItems:'center',
        justifyContent:'center',
    },
    backButton:{
    position:'absolute',
    left:20,
    },
    titleTextBlack:{
       color:'black',
    },
    titleTextWhite:{
        color:'white',
     },

});

export default LiveHeader;
