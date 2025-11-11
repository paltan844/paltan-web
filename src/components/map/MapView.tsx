import React, { useEffect, useState } from 'react';
import { GOOGLE_MAP_API } from '@service/config';
import { getPoints } from './getPoints';
import MapView, { Polyline, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { customMapStyle } from '@utils/CustomMap';
import { StyleSheet } from 'react-native';

const MapViewComponent = ({
  mapRef,
  deliveryPersonLocation,
  setMapRef,
  camera,
  pickupLocation,
  deliveryLocation,
  hasPickedUp,
  hasAccepted,
}: any) => {
  const [showDottedLine, setShowDottedLine] = useState(false);
  const shouldShowRoute =
    pickupLocation &&
    deliveryLocation &&
    (hasAccepted || hasPickedUp);

  useEffect(() => {
    let timer: any;

    if (pickupLocation?.latitude && deliveryLocation?.latitude) {
      timer = setTimeout(() => {
        setShowDottedLine(true);
      }, 3000);
    } else {
      setShowDottedLine(false);
    }

    return () => clearTimeout(timer);
  }, [hasPickedUp, pickupLocation, deliveryLocation]);

  useEffect(() => {
    if (mapRef && pickupLocation && deliveryLocation && !deliveryPersonLocation) {
      mapRef.fitToCoordinates([pickupLocation, deliveryLocation], {
             edgePadding: { top: 30, right: 40, bottom: 30, left: 40 },
             animated: true,
      });
    }
  }, [mapRef, pickupLocation, deliveryLocation, deliveryPersonLocation]);

  return (
    <MapView
      ref={setMapRef}
      style={styles.map}
      provider="google"
      camera={camera}
      customMapStyle={customMapStyle}
      showsUserLocation={true}
      userLocationCalloutEnabled={true}
      userLocationPriority="high"
      pitchEnabled={false}
      followsUserLocation={true}
      showsCompass={true}
      showsBuildings={false}
      showsIndoors={false}
      showsScale={false}
      showsIndoorLevelPicker={false}
    >
      {shouldShowRoute && deliveryPersonLocation && (
        <MapViewDirections
          origin={deliveryPersonLocation}
          destination={hasPickedUp ? deliveryLocation : pickupLocation}
          precision="high"
          apikey={GOOGLE_MAP_API}
          strokeColor="#2871F2"
          strokeWidth={5}
          onError={(err) => {
            console.error('MapViewDirections error:', err);
          }}
        />
      )}

      {deliveryPersonLocation?.latitude && (
        <Marker
          image={require('@assets/icons/delivery.png')}
          coordinate={deliveryPersonLocation}
          style={styles.markerIcon}
        />
      )}

      {pickupLocation?.latitude && (
        <Marker
          image={require('@assets/icons/store.png')}
          coordinate={pickupLocation}
          style={styles.markerIcon}
        />
      )}

      {deliveryLocation?.latitude && (
        <Marker
          image={require('@assets/icons/my_pin.png')}
          coordinate={deliveryLocation}
          style={styles.markerIcon}
        />
      )}

      {showDottedLine && (
        <Polyline
          coordinates={getPoints([pickupLocation, deliveryLocation])}
          strokeColor="red"
          strokeWidth={3}
          geodesic={true}
          lineDashPattern={[12, 10]}
        />
      )}
    </MapView>
  );
};


const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerIcon: {
    height: 1,
    width: 1,
  },
});

export default MapViewComponent;
