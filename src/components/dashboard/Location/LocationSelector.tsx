import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,
  Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { goBack, navigate, replace } from '@utils/NavigationUtils';
import { getAddresses, mmkvStorage, saveAddresses } from '@state/storage';
import DeliveryAreaModal from './DeliveryAreaModal';
import ManualPincodeModal from './ManualPincodeModal';
import AddressSummaryModal from './AddressSummaryModal';
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { useLocationStore, useLocationStorePincode } from '@state/locationStore';
import { FlashList } from '@shopify/flash-list';
import { useAuthStore } from '@state/authStore';
import { capitalizeWords, formatSelectedLocation } from '@utils/AddressPreview';

const { height } = Dimensions.get('window');

type Pincode = {
  code: string;
};

type District = {
  name: string;
  pincodes: Pincode[];
};

type StateData = {
  name: string;
  districts: District[];
};

type CombinedRouteParams = {
  onAddressAdded?: (address: string, addressDetail: any) => void;
  onAddressEdit?: (address: string, addressDetail: any) => void;
  existingAddress?: string;
  source?: 'productorder' | 'livetracking' | string;
};


const LocationSelector: React.FC = () => {
  const { selectedLocation, setSelectedLocation } = useLocationStore();
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<Record<string, string[]>>({});
  const [pincodes, setPincodes] = useState<Record<string, string[]>>({});
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [areaModalVisible, setAreaModalVisible] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState<string>('211001');
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [allowedPincodes, setAllowedPincodes] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [addressDetail, setAddressDetail] = useState<any>({});

  const route = useRoute<RouteProp<Record<string, CombinedRouteParams>, string>>();
  const { onAddressAdded, onAddressEdit, existingAddress,  source } = route.params || {};
  const { fetchLocationData, locationData } = useLocationStorePincode();
  const { user } = useAuthStore();

  const handleHomePress = () => {
    const saved = mmkvStorage.getItem(`addressDetail_${selectedLocation}`);
    if (saved) {
      setAddressDetail(JSON.parse(saved));
    } else {
      setAddressDetail({ address: selectedLocation });
    }
    setSelectedAddress(selectedLocation);
    setSummaryVisible(true);
  };

useEffect(() => {
  fetchLocationData();
}, []);

useEffect(() => {
  if (locationData.length > 0) {
    const stateNames = locationData.map(s => s.name);
    const districtMap: Record<string, string[]> = {};
    const pincodeMap: Record<string, string[]> = {};

    locationData.forEach((state: StateData) => {
      districtMap[state.name] = state.districts.map((d: District) => d.name);
      state.districts.forEach((district: District) => {
        pincodeMap[district.name] = district.pincodes.map((p: Pincode) => p.code);
      });
    });

    setAvailableStates(stateNames);
    setDistricts(districtMap);
    setPincodes(pincodeMap);
    setAllowedPincodes(Object.values(pincodeMap).flat());
  }
}, [locationData]);

  useEffect(() => {
    const loadSavedAddresses = () => {
      if (!user) {
        setSelectedLocation('');
        return;
      }
      const saved = getAddresses();
      const savedSelected = mmkvStorage.getItem('selectedLocation');

      if (savedSelected && saved.includes(savedSelected)) {
        setSelectedLocation(savedSelected);
      } else if (saved.length > 0) {
        setSelectedLocation(saved[0]);
        mmkvStorage.setItem('selectedLocation', saved[0]);
      } else {
        setSelectedLocation('');
      }
      setStates(saved);
    };
    loadSavedAddresses();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedAddress(null);
      setSummaryVisible(false);
    }, [])
  );

  const handleSaveAddress = (newAddress: string, addressDetail: any) => {
    const saved = getAddresses();

    if (!saved.includes(newAddress)) {
      const updated = [...saved, newAddress];
      saveAddresses(updated);
      setStates(updated);
    }

    setSelectedLocation(newAddress);
    mmkvStorage.setItem('selectedLocation', newAddress);
    mmkvStorage.setItem(`addressDetail_${newAddress}`, JSON.stringify(addressDetail));
    setSelectedPincode(addressDetail.pincode);
  };


  const handleSelect = (location: string) => {
    setSelectedLocation(location);
    mmkvStorage.setItem('selectedLocation', location);

    const savedDetail = mmkvStorage.getItem(`addressDetail_${location}`);
    if (savedDetail) {
      try {
        const detail = JSON.parse(savedDetail);
        if (detail?.pincode) {
          setSelectedPincode(detail.pincode);
        }
       useLocationStore.getState().setSelectedLocationObject(detail);
      } catch (e) {
        console.warn('Error parsing address detail', e);
      }
    }
  };

  const handleLongPress = (item: string) => {
    const saved = mmkvStorage.getItem(`addressDetail_${item}`);
    if (saved) {
      setAddressDetail(JSON.parse(saved));
    } else {
      setAddressDetail({ address: item });
    }
    setSelectedAddress(item);
    setSummaryVisible(true);
  };

  const handleDelete = () => {
    if (selectedAddress) {
      mmkvStorage.removeItem(`addressDetail_${selectedAddress}`);

      setStates(prev => {
        const updated = prev.filter(item => item !== selectedAddress);
        saveAddresses(updated);

        if (selectedLocation === selectedAddress) {
          const fallback = updated[0] || 'Somewhere, Knowwhere 😃';
          setSelectedLocation(fallback);
          mmkvStorage.setItem('selectedLocation', fallback);
        }
        return updated;
      });

      setSelectedAddress(null);
      setShowOptionsModal(false);
      setSummaryVisible(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSummaryVisible(false);
      setManualModalVisible(false);
      setAreaModalVisible(false);
      setSelectedAddress(null);
    }, [])
  );

  return (
    <View style={styles.backdrop}>
  <TouchableOpacity style={styles.backdropTouchable} activeOpacity={1} onPress={() => goBack()} />
  <View style={styles.sheetContainer}>
    <View style={styles.rowContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.bottomSheet}>
              <Text style={styles.modalTitle}>Select location</Text>
              <TouchableOpacity onPress={() => goBack()}>
                <Icon name="close" size={RFValue(20)} color="#FF5C5C" />
              </TouchableOpacity>
            </View>
           <Text style={styles.infoText}>Select a pincode or location to check availability</Text>

           <TouchableOpacity
  style={styles.locationRow}
  activeOpacity={0.8}
  onPress={() => {
    if (source) {
      replace('CurrentLocationScreen', {
        allowedPincodes: allowedPincodes,
        onAddressAdded: handleSaveAddress,
        source,
      });
    } else {
      navigate('CurrentLocationScreen', {
        allowedPincodes: allowedPincodes,
        onAddressAdded: handleSaveAddress,
        source,
      });
    }
  }}
>
  <Icon name="crosshairs-gps" size={RFValue(17)} color="#00BA3C" />
  <Text style={styles.homeLabel}> Use Current Location </Text>
  <Icon name="chevron-right" size={RFValue(20)} color="#000" style={{ marginLeft: 'auto' }} />
</TouchableOpacity>


<View style={styles.locationHeader}>
  <TouchableOpacity
    style={styles.locationRow}
    activeOpacity={0.8}
    onPress={handleHomePress}
  >
    <Icon name="home-outline" size={RFValue(19)} color="#00BA3C" />
    <Text style={styles.homeLabel}> Home - </Text>
    <Text style={styles.locationText} numberOfLines={1}>
  {selectedLocation ? capitalizeWords(formatSelectedLocation(selectedLocation)) : 'Somewhere, Knowwhere 😃'}
</Text>
    <Icon name="chevron-right" size={RFValue(20)} color="#000" style={{ marginLeft: 'auto' }} />
  </TouchableOpacity>
</View>


<View style={styles.pincode}>
  <View >
  <TouchableOpacity onPress={() => setManualModalVisible(true)} style={styles.locationRow}>
    <Icon name="map-marker-outline" size={RFValue(19)} color="#00BA3C" />
    <Text style={styles.homeLabel}> Enter a pincode - </Text>
    <Text style={styles.pincodecolor}>  {selectedPincode} </Text>
    <Icon name="chevron-right" size={RFValue(20)} color="#000" style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  </View>
</View>


<View style={styles.pincode}>
<TouchableOpacity onPress={() => setAreaModalVisible(true)} style={styles.locationRow}>
  <Icon name="truck-delivery-outline" size={RFValue(17)} color="#00BA3C" />
  <Text style={styles.homeLabel}>  Delivery Available in </Text>
  <Icon name="chevron-right" size={RFValue(20)} color="#000" style={{ marginLeft: 'auto' }} />
</TouchableOpacity>
</View>

<View style={styles.listContentContainer}>
            <FlashList
              data={[...(states || []), 'ADD_NEW_ADDRESS']}
              keyExtractor={(item, index) => item + index}
              numColumns={2}
              estimatedItemSize={190}
              renderItem={({ item }) =>
                item === 'ADD_NEW_ADDRESS' ? (
                  <TouchableOpacity
                  onPress={() => {
    if (source) {
      replace('CurrentLocationScreen', {
        allowedPincodes: allowedPincodes,
        onAddressAdded: handleSaveAddress,
        source,
      });
    } else {
      navigate('CurrentLocationScreen', {
        allowedPincodes: allowedPincodes,
        onAddressAdded: handleSaveAddress,
        source,
      });
    }
  }}
                  style={styles.addressCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.centerContent}>
    <View style={styles.addicon}>
      <Icon name="plus" size={RFValue(22)} color="#fff" />
    </View>
    <Text style={styles.addText}>Add New Address</Text>
  </View>
  <View style={styles.arrowWrapper}>
    <Icon name="chevron-right" size={RFValue(18)} color="#fff" />
  </View>
</TouchableOpacity>
                ) : (
                  <TouchableOpacity
  style={[styles.selectedItem, item === selectedLocation && styles.highlightedItem]}
  onPress={() => handleSelect(item)}
  onLongPress={() => handleLongPress(item)}
  activeOpacity={0.8}
>

  <Text style={[styles.itemText, item === selectedLocation && styles.highlightedItemText]}>
    {capitalizeWords(formatSelectedLocation(item))}
  </Text>
</TouchableOpacity>

                )
              }
            />
            </View>
          </View>


<DeliveryAreaModal
  visible={areaModalVisible}
  onClose={() => setAreaModalVisible(false)}
  onSelectPincode={(pincode) => {
    setSelectedPincode(pincode);
  }}
 STATES={availableStates}
  DISTRICTS={districts}
  PINCODES={pincodes}
/>


<ManualPincodeModal
  visible={manualModalVisible}
  onClose={() => setManualModalVisible(false)}
  allowedPincodes={allowedPincodes}
  onSubmit={(enteredPincode, isAvailable) => {
    if (isAvailable) {
      setSelectedPincode(enteredPincode);
    } else {
      Alert.alert('Service Unavailable', 'Sorry, delivery is not available in your area.');
    }
  }}
/>

<AddressSummaryModal
  visible={summaryVisible}
  onClose={() => setSummaryVisible(false)}
  onEdit={() => {
  setSummaryVisible(false);

  setTimeout(() => {
    const addressParams = {
      existingAddress: selectedAddress,
      prefillAddress: { ...addressDetail },
      onAddressEdit: (updatedAddress: string, updatedDetail: any) => {
        const saved = getAddresses();

        const updated = saved.map(item =>
          item === selectedAddress ? updatedAddress : item
        );
        saveAddresses(updated);
        setStates(updated);
       setSelectedLocation(updatedAddress);
mmkvStorage.setItem('selectedLocation', updatedAddress);
mmkvStorage.setItem(`addressDetail_${updatedAddress}`, JSON.stringify(updatedDetail));

        setSummaryVisible(false);
        setSelectedAddress(null);
        setSelectedPincode(updatedDetail.pincode);
      },
      allowedPincodes,
      source,
    };

    if (source) {
      replace('addressdetail', addressParams);
    } else {
      navigate('addressdetail', addressParams);
    }
  }, 200);
}}

  onDelete={handleDelete}
  address={addressDetail}
/>
    </View>
  </View>
</View>

  );
};

export default LocationSelector;

const styles = StyleSheet.create({
  addressCard: {
  height: 160,
  width: 170,
  backgroundColor: '#f4f4f4',
  borderRadius: 12,
  marginHorizontal: 8,
  marginTop: 20,
  marginBottom: 12,
  padding: 12,
  justifyContent: 'flex-start',
  //justifyContent: 'center',
  alignItems: 'center',
},

centerContent: {
  //flex: 1,
    marginTop: 20,
  //justifyContent: 'center',
  alignItems: 'center',
},
addicon: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#3e9359',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 10,
},

addText: {
  color: '#3e9359',
  fontSize: RFValue(13),
  fontWeight: '600',
  textAlign: 'center',
},

arrowWrapper: {
  position: 'absolute',
  bottom: 10,
  right: 10,
  backgroundColor: '#6d6666',
  borderRadius: 20,
  padding: 6,
  alignItems: 'center',
  justifyContent: 'center',
},

  locationRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 8,
  paddingHorizontal: 5,
  borderBottomWidth: 0.5,
  borderColor: '#E0E0E0',
},
  highlightedItem: {
    backgroundColor: 'rgba(0, 186, 60, 0.1)',
    borderColor:'#3e9359ff',
    borderWidth: 1,
  },
  highlightedItemText: {
    fontWeight: 'bold',
    color: '#000',
  },
  add: {
    color: '#3e9359ff',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    marginLeft: 8,
  },
  addressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  optionButton: {
    paddingHorizontal: 2,
    backgroundColor: '#00BA3C',
    borderRadius: 8,
    marginVertical: 5,
    paddingVertical: 6,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },

  address: {
  height: 180,
  backgroundColor: '#cec7c7ff',
  marginHorizontal: 8,
  paddingVertical: 20,
  paddingHorizontal: 12,
  borderRadius: 10,
  marginTop: 19,
  marginBottom: 10,
  width: 173,
  justifyContent: 'space-between',
},
rowstyle: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 0,
},
arrowDown: {
  backgroundColor: '#6d6666ff',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 20,
  padding: 4,
  alignSelf: 'flex-end',
  marginTop: 10,
},
  pincodecolor: {
    backgroundColor: '#E8E8E8',
     fontWeight: 'bold',
    fontSize: RFValue(12),
    borderRadius: 5,
    color: 'rgba(115, 97, 97, 1)',
    flexShrink: 0,
  },
  pincode: {
    paddingHorizontal: 0,
  },
  rowContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:0,
    padding: 10,
   },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      },
      backdropTouchable: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
      },
      sheetContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        minHeight: height * 0.65,
        width: '100%',
        paddingTop: 10,
        alignSelf: 'stretch',
      },
  home: {
    marginRight: 3,
    marginBottom: 5,
  },
  listContentContainer: {
  height:300,
  paddingBottom:8,
},
  homeLabel: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
    color: '#000',
    flexShrink: 0,
  },
  locationText: {
    fontSize: RFValue(12),
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 3,
  },
  locationHeader: {
    marginTop: 10,
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  infoText: {
    fontSize: RFValue(13),
    color: '#666',
    marginBottom: 0,
    marginTop: 5,
    paddingHorizontal: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
    marginTop: 0,
    paddingBottom: 2,
    paddingHorizontal: 5,
    backgroundColor: '#F2F2F2',
    borderRadius: 7,
    overflow: 'hidden',
  },
  text: {
    color: '#000',
    fontSize: RFValue(12),
    flex: 1,
    fontWeight: 'bold',
    flexShrink: 1,
    flexGrow: 1,
    paddingLeft: 5,
    paddingBottom: 2,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backgroundTouch: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  modalHeader: {
    width: '100%',
    maxHeight: height * 0.67,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    backgroundColor: '#fff',
    alignSelf: 'center',
    minHeight: 459,
  },
  modalTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    marginHorizontal: 8,
  },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: RFValue(14),
    color: '#000',
    left: 10,
  },
  selectedItem: {
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    marginHorizontal: 8,
    paddingVertical: 0,
    paddingRight:4,
    marginTop: 19,
    overflow:'hidden',
    paddingBottom: 0,
    marginBottom: 10,
    justifyContent: 'center',
    width: 173,
    height: 180,
  },
  selectedItemText: {
    fontWeight: 'bold',
    color: '#000',
  },
});






