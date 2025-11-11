import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  comparisonData: {
    platform?: string;
    price?: string;
    deliveryCharges?: string;
  }[];
  ourProduct: {
    price?: string;
    deliveryCharges?: string;
  };
}

const ComparisonModal: React.FC<Props> = ({ visible, onClose, comparisonData, ourProduct }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <CustomText variant="h5" fontFamily={Fonts.Bold}>Compare with Other Platforms</CustomText>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.table}>
              <View style={styles.row}>

                <View style={styles.cellHeader}><Text style={styles.headerText}>Platform</Text></View>
                <View style={styles.cellHeader}><Text style={styles.headerText}>Price</Text></View>
                <View style={styles.cellHeader}><Text style={styles.headerText}>Delivery Charges</Text></View>
              </View>

              <View style={[styles.row, styles.yourRow]}>
                <View style={styles.cell}><Text style={styles.yourText}>PALTAN</Text></View>
                <View style={styles.cell}><Text style={styles.yourText}>{ourProduct.price}</Text></View>
                <View style={styles.cell}><Text style={styles.yourText}>{ourProduct.deliveryCharges}</Text></View>
              </View>

              {comparisonData.map((item, index) => (
                <View key={index} style={styles.row}>
                  <View style={styles.cell}><Text>{item.platform}</Text></View>
                  <View style={styles.cell}><Text>{item.price}</Text></View>
                  <View style={styles.cell}><Text>{item.deliveryCharges}</Text></View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 4,
    borderColor: '#eee',
  },
  cellHeader: {
    padding: 5,
    paddingRight:35,
    width: 110,
    justifyContent:'center',

    backgroundColor: '#f0f0f0',
  },
  cell: {
    paddingHorizontal:12,
    padding: 8,
    minWidth: 110,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingRight:1,
  },
  yourRow: {
    backgroundColor: '#fffbea',
  },
  yourText: {
    fontWeight: '600',
    color: '#333',
  },
});

export default ComparisonModal;
