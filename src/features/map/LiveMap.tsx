import {View, StyleSheet, TouchableOpacity} from 'react-native';
import  React, { FC, useEffect }  from 'react';
import { Colors } from '@utils/Constants';
import { screenHeight } from '@utils/Scaling';
import { useMapRefStore } from '@state/mapStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { handleFitToPath } from '@components/map/mapUtilis';
import MapViewComponent from '@components/map/MapView';

interface LiveMapProps{
    deliveryPersonLocation:any;
    pickupLocation: any;
    deliveryLocation:any;
    hasPickedUp :any;
    hasAccepted :any;
}

const LiveMap:FC <LiveMapProps> = (
    {
    deliveryPersonLocation,
    pickupLocation,
    deliveryLocation,
    hasPickedUp,
    hasAccepted,
    }
) => {
    const {mapRef,setMapRef} = useMapRefStore();

useEffect(()=>{
if(mapRef){
    handleFitToPath(
    mapRef,
    deliveryPersonLocation,
    pickupLocation,
    deliveryLocation,
    hasPickedUp,
    hasAccepted
    );
}
},[mapRef, deliveryPersonLocation, hasAccepted, hasPickedUp, deliveryLocation]);

        return (
            <View style={styles.Container}>
                <MapViewComponent
                mapRef={mapRef}
setMapRef={setMapRef}
hasAccepted={hasAccepted}
deliveryLocation={deliveryLocation}
deliveryPersonLocation={deliveryPersonLocation}
pickupLocation={pickupLocation}
hasPickedUp={hasPickedUp}
                />
                <TouchableOpacity style={styles.fitButton}
                onPress={()=>{
                    handleFitToPath(
                        mapRef,
                        deliveryPersonLocation,
                        pickupLocation,
                        deliveryLocation,
                        hasPickedUp,
                        hasAccepted
                        );
                }}
                >
                    <Icon name="target" size={RFValue(22)} color={Colors.text}/>
                </TouchableOpacity>
            </View>
    );
};

const styles = StyleSheet.create({
    Container:{
        borderRadius:15,
        borderWidth:1,
        backgroundColor:'#fff',
        overflow:'hidden',
        borderColor:Colors.border,
        height:screenHeight * 0.35,
        width:'100%',
        position:'relative',
    },
        fitButton:{
            padding:5,
            right:9,
            bottom:16,
            borderWidth:0.5,
            backgroundColor:'#fff',
            shadowOpacity:0.2,
            shadowOffset:{width:1,height:2},
            borderColor:Colors.border,
            shadowRadius:10,
            shadowColor:'black',
            elevation:5,
            position:'absolute',
            borderRadius:10,
        },
});

export default LiveMap;
