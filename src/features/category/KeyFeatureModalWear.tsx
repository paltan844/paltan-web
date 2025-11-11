import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  visible: boolean;
  onClose: () => void;
  extraDetails: {
    ingredients: string[];
    howToUse: string;
    flavourNote: string;
    secondaryCamera: string;
  };
}

const KeyFeaturesModalWear: React.FC<Props> = ({ visible, onClose, extraDetails }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.fullScreen}>
        {/* Modal wrapper with shade behind modal only */}
        <View style={styles.modalWrapper}>
          <View style={styles.sideModal}>
            <View style={styles.header}>
              <CustomText variant="h5" fontFamily={Fonts.Bold}>Key Features</CustomText>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={29} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

  {/* Ingredients */}
  {extraDetails.ingredients &&
    Array.isArray(extraDetails.ingredients) &&
    extraDetails.ingredients.length > 0 &&
    extraDetails.ingredients[0] !== 'N/A' && (
      <View style={styles.featureItem}>
        <CustomText variant="h8" fontFamily={Fonts.Medium}>Fit:</CustomText>
        {extraDetails.ingredients.map((item, index) => (
          <CustomText key={index} variant="h8" style={styles.bulletText}>• {item}</CustomText>
        ))}
      </View>
  )}

  {/* How to Use */}
  {extraDetails.howToUse && extraDetails.howToUse !== 'N/A' && (
    <View style={styles.featureItem}>
      <CustomText variant="h8" fontFamily={Fonts.Medium}>Pattern:</CustomText>
      <CustomText variant="h8" style={styles.bulletText}>{extraDetails.howToUse}</CustomText>
    </View>
  )}

  {/* Flavour Note */}
  {extraDetails.flavourNote && extraDetails.flavourNote !== 'N/A' && (
    <View style={styles.featureItem}>
      <CustomText variant="h8" fontFamily={Fonts.Medium}>Ocassion:</CustomText>
      <CustomText variant="h8" style={styles.bulletText}>{extraDetails.flavourNote}</CustomText>
    </View>
  )}

  {extraDetails.secondaryCamera && extraDetails.secondaryCamera !== 'N/A' && (
    <View style={styles.featureItem}>
      <CustomText variant="h8" fontFamily={Fonts.Medium}>Fabric</CustomText>
      <CustomText variant="h8" style={styles.bulletText}>{extraDetails.secondaryCamera}</CustomText>
    </View>
  )}

</ScrollView>

          </View>
        </View>

        {/* Rest of screen, tappable area to close modal */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.restArea} />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    flexDirection: 'row',
  },
  modalWrapper: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.4)', // shade behind modal only
  },
  sideModal: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    height: '50%',
    marginTop: '20%',
    marginBottom: '5%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  content: {
    paddingBottom: 20,
  },
  featureItem: {
    marginBottom: 16,
  },
  bulletText: {
    marginLeft: 10,
    marginTop: 4,
    fontFamily:'200',
    fontWeight:'900',
  },
  restArea: {
    flex: 1,
  },
});

export default KeyFeaturesModalWear;
