export const handleFitToPath = (
  mapRef: any,
  deliveryPersonLocation: any,
  pickupLocation: any,
  deliveryLocation: any,
  hasPickedUp: any,
  hasAccepted: any
) => {
  if (!mapRef) {return;}

  const coords: any[] = [];

  if (pickupLocation?.latitude && pickupLocation?.longitude) {
    coords.push(pickupLocation);
  }

  if (deliveryLocation?.latitude && deliveryLocation?.longitude) {
    coords.push(deliveryLocation);
  }

  if ((hasAccepted || hasPickedUp) && deliveryPersonLocation?.latitude && deliveryPersonLocation?.longitude) {
    coords.push(deliveryPersonLocation);
  }

  if (coords.length >= 2) {
    mapRef.fitToCoordinates(coords, {
      edgePadding: { top: 30, right: 40, bottom: 30, left: 40 },
      animated: true,
    });
  } else {
    console.warn('Not enough coordinates to fit map:', coords);
  }
};
