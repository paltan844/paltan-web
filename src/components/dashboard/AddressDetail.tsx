import React, { FC, useState, useEffect, useRef } from 'react';
import {
  View,TextInput,Text,  ScrollView,TouchableOpacity, StyleSheet,
  Animated,Alert,Keyboard,TouchableWithoutFeedback, BackHandler 
  } from 'react-native';
import CustomHeader from '@components/ui/CustomHeader';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@state/authStore';
import { mmkvStorage } from '@state/storage';
import { goBack, replace, resetAndNavigate } from '@utils/NavigationUtils';
import { useLocationStore } from '@state/locationStore';

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  autoCorrect,
  spellCheck,
  editable = true,
  children,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  autoCorrect?: boolean;
  spellCheck?: boolean;
  editable?: boolean;
  children?: React.ReactNode;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value !== '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  return (
    <View style={{ marginBottom: 20 }}>
      <Animated.Text
        style={{
          position: 'absolute',
          left: 0,
          top: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [18, 0],
          }),
          fontSize: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
          }),
          color: '#999',
        }}
      >
        {label}
      </Animated.Text>
      <TextInput
        style={[styles.input,
          { paddingTop: 18},
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
        editable={editable}
      />
        {children}
    </View>
  );
};

const AddressDetail: FC = () => {
  const [selectedType, setSelectedType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const keyboardHeight = useKeyboardOffsetHeight();
 const route = useRoute<any>();
  const navigation = useNavigation();
  const { onAddressAdded, onAddressEdit, existingAddress, allowedPincodes,source } = route.params as {
    onAddressAdded?: (address: string, addressDetail: any) => void;
    onAddressEdit?: (address: string, addressDetail: any) => void;
    existingAddress?: string;
    allowedPincodes: string[];
    source?: string;
  };
  const { user } = useAuthStore();
  const { prefillAddress } = route.params || {};
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [towerNo, setTowerNo] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverMobile, setReceiverMobile] = useState('');
   const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

const isPrefilled = !!prefillAddress;
const isAddressMissing = !fullAddress?.trim();


  useEffect(() => {
    if (prefillAddress) {
      setFullAddress(prefillAddress.fullAddress || '');
      setCity(prefillAddress.city || '');
      setStateName(prefillAddress.state || '');
      setPinCode(prefillAddress.pincode || '');
      setHouseNo(prefillAddress.houseNo || '');
      setFloorNo(prefillAddress.floorNo || '');
      setTowerNo(prefillAddress.towerNo || '');
      setBuildingName(prefillAddress.buildingName || '');
      setLandmark(prefillAddress.landmark || '');
      setSelectedType(prefillAddress.selectedType || 'Home');
      setLatitude(prefillAddress.latitude || '');
      setLongitude(prefillAddress.longitude || '');
    }
  }, []);

  useEffect(() => {
    if (user) {
      setReceiverName(user.name || '');
      setReceiverMobile(user.phone?.toString() || '');
    } else {
      const storedName = mmkvStorage.getItem('userFullName') || '';
      const storedPhone = mmkvStorage.getItem('userPhone') || '';
      setReceiverName(storedName);
      setReceiverMobile(storedPhone);
    }
  }, []);

  useEffect(() => {
    if (existingAddress) {
      const lines = existingAddress.split('\n').map(line => line.trim());

      if (lines.length >= 4) {
        const firstLineParts = lines[0].split(',').map(p => p.trim());
        setHouseNo(firstLineParts[0] || '');
        setFloorNo(firstLineParts[1]?.replace(' Floor', '').trim() || '');
        setTowerNo(firstLineParts[2] || '');
        setBuildingName(firstLineParts[3] || '');

        const secondLineParts = lines[1].split(',').map(p => p.trim());
        setFullAddress(secondLineParts[0] || '');
        setLandmark(secondLineParts[1] || '');

        const cityStateParts = lines[2].split(',').map(p => p.trim());
        setCity(cityStateParts[0] || '');
        const statePincode = cityStateParts[1]?.split('-').map(p => p.trim()) || [];
        setStateName(statePincode[0] || '');
        setPinCode(statePincode[1] || '');

        const typeMatch = lines[3].match(/\((.*?)\)/);
        if (typeMatch) {setSelectedType(typeMatch[1] as 'Home' | 'Work' | 'Other');}

        const receiverMatch = lines[4]?.match(/Receiver:\s*(.*?),\s*(.*)/);
        if (receiverMatch) {
          setReceiverName(receiverMatch[1] || '');
          setReceiverMobile(receiverMatch[2] || '');
        }
      }
    }
  }, []);


  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);


  const handleSave = () => {
    if (
      pinCode.trim() === '' ||
      city.trim() === '' ||
      stateName.trim() === '' ||
      fullAddress.trim() === '' ||
      receiverName.trim() === '' ||
      receiverMobile.trim() === ''
    ) {
      Alert.alert('Please fill all required fields!');
      return;
    }

  const addressParts = [
  `House No: ${houseNo?.trim() || ''}`,
  `Floor: ${floorNo?.trim() || ''}`,
  `Tower: ${towerNo?.trim() || ''}`,
  `Building: ${buildingName?.trim() || ''}`,
  `Address: ${fullAddress?.trim() || ''}`,
  `Landmark: ${landmark?.trim() || ''}`,
  `City: ${city?.trim() || ''}`,
  `State: ${stateName?.trim() || ''}`,
  `Pincode: ${pinCode?.trim() || ''}`,
  `Type: ${selectedType || ''}`,
  `Receiver: ${receiverName?.trim() || ''}, ${receiverMobile?.trim() || ''}`,
  `Latitude: ${latitude?.trim() || ''}, Longitude: ${longitude?.trim() || ''}`,
];

const compiledAddress = addressParts.join(', ');


const fullAddressDetail = {
      houseNo: houseNo.trim(),
      floorNo: floorNo.trim(),
      towerNo: towerNo.trim(),
      buildingName: buildingName.trim(),
      fullAddress: fullAddress.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pinCode.trim(),
      selectedType: selectedType,
      receiverName: receiverName.trim(),
      receiverMobile: receiverMobile.trim(),
      latitude: latitude,
      longitude: longitude,
    };

  useLocationStore.getState().setSelectedLocation(compiledAddress);
  useLocationStore.getState().setSelectedLocationObject(fullAddressDetail);

  if (onAddressEdit) {
    onAddressEdit(compiledAddress, fullAddressDetail);
  } else if (onAddressAdded) {
    onAddressAdded(compiledAddress, fullAddressDetail);
  }

    if (source === 'productorder') {
      goBack();
    } else if (source === 'livetracking') {
      goBack();
    } else {
      resetAndNavigate('MainTabs');
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
      <CustomHeader title="Add Address" />


        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FloatingLabelInput label="Pin Code*" value={pinCode} onChangeText={setPinCode} keyboardType="number-pad"  editable={false}  autoCorrect={false}
             spellCheck={false}/>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FloatingLabelInput label="City*" value={city} onChangeText={setCity} editable={false}   autoCorrect={false}
             spellCheck={false}/>
            </View>
            <View style={styles.halfInput}>
              <FloatingLabelInput label="State*" value={stateName} onChangeText={setStateName} editable={false}
             autoCorrect={false}
             spellCheck={false}/>
            </View>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="House No."
              value={houseNo}
              onChangeText={setHouseNo}
              autoCorrect={false}
              spellCheck={false}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Floor No."
              value={floorNo}
              onChangeText={setFloorNo}
              autoCorrect={false}
              spellCheck={false}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Building / Apartment Name"
            value={buildingName}
            onChangeText={setBuildingName}
            autoCorrect={false}
            spellCheck={false}
          />

            <FloatingLabelInput label="Landmark / Area" value={landmark} onChangeText={setLandmark}
            multiline={true}
            numberOfLines={2}
            autoCorrect={false}
            spellCheck={false} />

        {isAddressMissing ? (
  <TouchableOpacity
    style={styles.addLocationButton}
    onPress={() =>
      replace('CurrentLocationScreen', {
        allowedPincodes,
        onAddressAdded,
        //source: 'addressdetail',
      })
    }
  >
    <Text style={styles.addLocationText}>📍 Add Address*</Text>
  </TouchableOpacity>
) : (
  <>
    <FloatingLabelInput
      label="Address*"
      value={fullAddress}
      onChangeText={setFullAddress}
      multiline={true}
      numberOfLines={5}
      editable={!isPrefilled}
    />
    {isPrefilled && (
      <TouchableOpacity
        style={styles.addLocationButton}
        onPress={() =>
          replace('CurrentLocationScreen', {
            allowedPincodes,
            onAddressAdded,
          })
        }
      >
        <Text style={styles.addLocationText}>📍 Change Address*</Text>
      </TouchableOpacity>
    )}
  </>
)}


          <View style={styles.contactDetails}>
            <Text style={styles.contactTitle}>Delivery Contact Details</Text>
            <Text style={styles.contactSubtitle}>
              This mobile number will receive an OTP, required for collecting the order
            </Text>

            <FloatingLabelInput label="Receiver's Name*" value={receiverName} onChangeText={setReceiverName}   autoCorrect={false}
             spellCheck={false}/>
            <FloatingLabelInput
              label="Receiver's Mobile Number*"
              value={receiverMobile}
              onChangeText={setReceiverMobile}
              keyboardType="phone-pad"
                autoCorrect={false}
             spellCheck={false}
            />

            <Text style={styles.saveAsLabel}>Save As</Text>
            <View style={styles.saveAsContainer}>
              {['Home', 'Work', 'Other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.saveAsButton,
                    selectedType === type && styles.selectedSaveAsButton,
                  ]}
                  onPress={() => setSelectedType(type as 'Home' | 'Work' | 'Other')}
                >
                  <Text
                    style={[
                      styles.saveAsButtonText,
                      selectedType === type && styles.selectedSaveAsButtonText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.buttonview, { marginBottom: keyboardHeight }]}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save & Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 40,
  },
  addLocationButton: {
  marginTop: 1,
  padding: 1,
  backgroundColor: '#f9f9f9',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ccc',
  alignItems: 'center',
},
changeLocationButton: {
  marginTop: 0,
  alignSelf: 'flex-start',
  paddingHorizontal: 10,
  paddingVertical: 5,
  backgroundColor: '#e6f0ff',
  borderRadius: 6,
},
changeLocationText: {
  fontSize: 13,
  fontWeight: '500',
  color: '#007AFF',
},
addLocationText: {
  color: '#3978379f',
  fontWeight: '600',
  fontSize: 15,
},
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  contactDetails: {
    marginTop: 30,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  saveAsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  saveAsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  saveAsButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedSaveAsButton: {
    backgroundColor: '#0078AA',
  },
  saveAsButtonText: {
    color: '#555',
    fontWeight: 'bold',
  },
  selectedSaveAsButtonText: {
    color: 'white',
  },
  buttonview: {
    backgroundColor: 'rgba(222, 215, 215, 0.5)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0078AA',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddressDetail;



