import { View, StyleSheet } from 'react-native';
import React, { FC} from 'react';
import { Colors, Fonts } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

const DeliveryDetails: FC<{ details: any }> = ({ details }) => {
  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <View style={styles.iconContainer}>
          <Icon name="bike-fast" color={Colors.disabled} size={RFValue(20)} />
        </View>
        <View>
          <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
            Your Delivery Details
          </CustomText>
          <CustomText variant="h8" fontFamily={Fonts.Medium}>
            Details of your current order
          </CustomText>
        </View>
      </View>

      <View style={styles.flexRow2}>
        <View style={styles.iconContainer}>
          <Icon name="account-outline" color={Colors.disabled} size={RFValue(20)} />
        </View>
        <View style={{ width: '80%' }}>
          <CustomText variant="h8" numberOfLines={2} fontFamily={Fonts.Regular}>
            Receiver's Name
          </CustomText>
          <CustomText variant="h8" fontFamily={Fonts.Medium}>
            {details?.receiverName || 'Not Assigned'}
          </CustomText>
        </View>
      </View>

      <View style={styles.flexRow2}>
        <View style={styles.iconContainer}>
          <Icon name="phone-outline" color={Colors.disabled} size={RFValue(20)} />
        </View>
        <View style={{ width: '80%' }}>
          <CustomText variant="h8" numberOfLines={2} fontFamily={Fonts.Regular}>
            Receiver's contact no.
          </CustomText>
          <CustomText variant="h8" fontFamily={Fonts.Medium}>
            {details?.receiverMobile || 'Not Available'}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    width: '100%',
    borderRadius: 15,
    marginVertical: 15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderColor: Colors.border,
    borderBottomWidth: 0.7,
  },
  flexRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
  },
});

export default DeliveryDetails;
