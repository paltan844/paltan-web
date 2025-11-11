import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, Platform, ActivityIndicator } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {  useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '@components/ui/CustomHeader';
import LocationSearchModal from './LocationSearchModal';
import { reverseGeocode } from '@service/locationMapService';
import { useAuthStore } from '@state/authStore';
import {  replace } from '@utils/NavigationUtils';
import axios from 'axios';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { GOOGLE_MAP_API } from '@service/config';
import LocationSkeleton from './LocationSkeleton';

type RouteParams = {
    allowedPincodes: string[];
    source?: string;
  };

const CurrentLocationScreen = () => {
  const { setUser } = useAuthStore();

  const mapRef = useRef<MapView>(null);
  const route = useRoute<any>();
  const { allowedPincodes = [], source } = route.params || {};

  const [region, setRegion] = useState<Region>({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [address, setAddress] = useState('');
  const [serviceAvailable, setServiceAvailable] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);

useEffect(() => {
  centerOnUserLocation();
}, []);


const checkAndRequestLocationPermission = async () => {
  try {
    let permission;

    if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    } else {
      permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    }

    let result = await check(permission);

    if (result === RESULTS.DENIED) {
      result = await request(permission);
    }

    if (result === RESULTS.GRANTED) {
      return true;
    }

    return false;
  } catch (err) {
    console.warn('Permission check error:', err);
    return false;
  }
};

const centerOnUserLocation = async (retries = 2) => {
  setIsUpdating(true);

  const hasPermission = await checkAndRequestLocationPermission();
  if (!hasPermission) {
    Alert.alert(
      'Permission Required',
      'Please enable location permission in settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openSettings() },
      ]
    );
    setIsUpdating(false);
    return;
  }

  const tryGetLocation = (attemptsLeft: number) => {
    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 500);
        handleReverseGeocode(latitude, longitude);
        setIsUpdating(false);
      },
      err => {
        console.warn('LOCATION ERROR:', err);

        if (attemptsLeft > 0) {
          console.log(`Retrying... attempts left: ${attemptsLeft}`);
          tryGetLocation(attemptsLeft - 1);
        } else {
          setIsUpdating(false);
          Alert.alert(
            'Location Error',
            err.message ||
              'Unable to get current location. Please make sure GPS is turned on.',
            [{ text: 'Retry', onPress: () => centerOnUserLocation(retries) }, { text: 'Cancel', style: 'cancel' }]
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      }
    );
  };

  tryGetLocation(retries);
};


/*
const centerOnUserLocation = async () => {
  try {
    setIsUpdating(true);
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);

    if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      if (requestResult !== RESULTS.GRANTED) {
        Alert.alert(
          'Location Required',
          'Please enable location permission in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
        return;
      }
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Location permission is blocked. Please enable it from settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() },
        ]
      );
      return;
    }

    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const newRegion = { ...region, latitude, longitude };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 500);
        handleReverseGeocode(latitude, longitude);
        setIsUpdating(false);
      },
      err => {
        console.warn(err);
        Alert.alert(
          'Location Error',
          'Unable to get current location. Please make sure GPS is turned on.',
          [
            { text: 'Retry', onPress: () => centerOnUserLocation() },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        setIsUpdating(false);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
  } catch (err) {
    console.warn('Error checking permissions:', err);
    Alert.alert('Error', 'Something went wrong while accessing location.');
    setIsUpdating(false);
  }
};
*/

  const moveToLocation = (lat: number, lng: number) => {
    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500);
    handleReverseGeocode(lat, lng);
  };




  const handleReverseGeocode = async (lat: number, lng: number) => {
    const result = await reverseGeocode(lat, lng, setUser);
    if (result) {
      setAddress(result.address);
      setGeoData(result);
      setServiceAvailable(allowedPincodes.includes(result.pincode));
    } else {
      console.warn('❌ Reverse Geocode failed, no result');
    }
  };


  const geocodeAndMove = async (addressString: string) => {
    try {
      const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: addressString,
          key: GOOGLE_MAP_API,
        },
      });

      if (res.data.status === 'OK') {
        const { lat, lng } = res.data.results[0].geometry.location;
        moveToLocation(lat, lng);
        setAddress(res.data.results[0].formatted_address);
      } else {
        Alert.alert('Error', 'Unable to find location');
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to geocode the address');
    }
  };



  const handlePlaceSelect = async (placeId: string, description: string) => {
    try {
      const res = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          key: GOOGLE_MAP_API,
        },
      });

      if (res.data.status === 'OK' && res.data.result?.geometry?.location) {
        const { lat, lng } = res.data.result.geometry.location;
        moveToLocation(lat, lng);
        setAddress(description);
      } else {
        Alert.alert('Error', 'Unable to fetch location details');
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch location details');
    }
  };

  const handleConfirm = () => {
    if (!serviceAvailable) {
      Alert.alert('Sorry!', 'Service is not available at this location.');
      return;
    }

    replace('addressdetail', {
      allowedPincodes: allowedPincodes,
      onAddressAdded: route.params?.onAddressAdded,
      source,
      prefillAddress: {
        fullAddress: address,
        city: geoData?.city,
        state: geoData?.state,
        pincode: geoData?.pincode,
      latitude: String(region.latitude),
      longitude: String(region.longitude),
      },
    });
  };


  return (
    <View style={styles.container}>
      <CustomHeader title="Confirm Location 📍" />

<MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onRegionChange={() => {
          setIsUpdating(true);
          setAddress('');
        }}
        onRegionChangeComplete={reg => {
          setRegion(reg);
          handleReverseGeocode(reg.latitude, reg.longitude).finally(() => setIsUpdating(false));
        }}
      />

<View style={styles.markerFixed}>
        {!isUpdating && (
  <Text style={styles.pinInstruction}>Move pin to your exact location</Text>
)}

        <Icon name="map-marker" size={40} color="#FF5C5C" />
        <View style={styles.markerDot} />
      </View>

      <TouchableOpacity style={styles.searchContainer} onPress={() => setSearchModalVisible(true)} activeOpacity={0.85}>
      <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <Text style={styles.searchInput}>Search for a new area, locality...</Text>
      </TouchableOpacity>

<View style={styles.bottomSheet}>
  <Text style={styles.deliveryText}>Your order will be delivered here</Text>

  {isUpdating ? (
    <>
      <Text style={styles.addressText}>Getting your pin location...</Text>
      <LocationSkeleton />
    </>
  ) : (
    <>
      <View style={styles.addressContainer}>
  <Text style={styles.addressText} numberOfLines={2}>
    {address || 'Fetching your location...'}
  </Text>
</View>


      <TouchableOpacity style={styles.confirmButton} onPress={centerOnUserLocation}>
        <Text style={styles.confirmText}>Use current location</Text>
      </TouchableOpacity>


      {serviceAvailable ? (
        <TouchableOpacity style={[styles.confirmButton, { backgroundColor: '#FF5C5C' }]} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm this location</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.serviceText}>Sorry, we're not here yet!</Text>
          <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
            <Text style={styles.manualSelect}>Select location manually</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  )}
</View>

      <LocationSearchModal
  visible={searchModalVisible}
  onClose={() => setSearchModalVisible(false)}
  onUseCurrentLocation={() => {
    setSearchModalVisible(false);
    centerOnUserLocation();
  }}
  onSelectLocation={(placeId, description) => {
    if (placeId) {
      handlePlaceSelect(placeId, description);
    } else {
      geocodeAndMove(description);
    }
    setSearchModalVisible(false);
  }}
/>

{isUpdating && (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    borderRadius: 7,
    height:90,
    width:90,
    top: 200,
    left: 151,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(100,100,100,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  container: { flex: 1 },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    alignItems: 'center',
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5C5C',
    marginTop: 2,
  },
  pinInstruction: {
    position: 'absolute',
    width:190,
    top: -25,
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    backgroundColor: 'rgba(1,1,1,0.8)',
    paddingHorizontal: 0,
    paddingVertical: 3,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
searchIcon: {
  marginRight: 10,
},
  searchContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 66,
    width: '94%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  searchInput: { color: '#888' },
  bottomSheet: {
    borderRadius:10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  deliveryText: { fontSize: 16, marginBottom: 10 },
  addressText: {
     fontSize: 14,
     color: '#444', textAlign: 'center', marginBottom: 4,
     },
     addressContainer: {
      backgroundColor: '#F0F0F0',
      paddingHorizontal: 12,
      paddingVertical: 2,
      borderRadius: 8,
      marginTop: 4,
      maxWidth: '100%',
    },
  confirmButton: {
    backgroundColor: '#00BA3C',
    padding: 10,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  confirmText: { color: '#fff', fontWeight: 'bold' },
  serviceText: { marginTop: 10, color: 'red', fontWeight: 'bold' },
  manualSelect: { color: '#00BA3C', marginTop: 10, textDecorationLine: 'underline' },
});

export default CurrentLocationScreen;
