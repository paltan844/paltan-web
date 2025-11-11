import {View, StyleSheet} from 'react-native';
import  React, { FC, useEffect, useState }  from 'react';
import { useAuthStore } from '@state/authStore';
import { useCartStore } from '@state/cartStore';
import { fetchCustomerOrders } from '@service/orderService';
import CustomHeader from '@components/ui/CustomHeader';
import { FlatList } from 'react-native';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import WalletSection from './WalletSection';
import ActionButton from './ActionButton';
import OrderItem from './OrderItem';
import { tokenStorage } from '@state/storage';
import { resetAndNavigate } from '@utils/NavigationUtils';

const Profile:FC = () => {

const [orders,setOrders] = useState([]);
const {logout,user} = useAuthStore();
const {clearCart} = useCartStore();

const fetchOrders = async()=>{
    const data = await fetchCustomerOrders(user?._id);
    setOrders(data);
};

useEffect(()=>{
    fetchOrders();
},[]);

const renderHeader = ()=>{
    return(
        <View>
            <CustomText variant="h3" fontFamily={Fonts.SemiBold} >Your account</CustomText>
            <CustomText variant="h7" fontFamily={Fonts.Medium} >{user?.phone}</CustomText>

        <WalletSection />
        <CustomText variant="h8" style={styles.informativeText} >YOUR INFORMATION</CustomText>
        <ActionButton icon="book-outline" label="Address book"/>
        <ActionButton icon="information-circle-outline" label="About us"/>
        <ActionButton icon="log-out-outline" label="Logout" onPress={()=>{
            clearCart();
            logout();
            tokenStorage.clearAll();
            resetAndNavigate('CustomerLogin');
        }}/>
        <CustomText variant="h8" style={styles.pastText}>
            PAST ORDERS
        </CustomText>
        </View>
    );
};
const renderOrders = ({item, index}:any)=>{
    return(
        <OrderItem item={item} index={index}/>
    );
};

        return (
            <View style={styles.Container}>
                <CustomHeader title="Profile"/>
                <FlatList
                data={orders}
                ListHeaderComponent={renderHeader}
                renderItem={renderOrders}
                keyExtractor={(item:any)=> item?.orderId}
                contentContainerStyle={styles.scrollViewContent}
                />
            </View>
    );
};


const styles = StyleSheet.create({
    Container:{
        flex:1,
        backgroundColor:'#fff',
    },
        scrollViewContent:{
            padding:10,
            paddingTop:20,
            paddingBottom:100,
        },
        informativeText:{
            opacity:0.7,
            marginBottom:20,
        },
        pastText:{
            opacity:0.7,
            marginVertical:20,
        },
});
export default Profile;
