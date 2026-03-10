import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { X } from "lucide-react";  

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

const ComparisonModal: React.FC<Props> = ({
  visible,
  onClose,
  comparisonData,
  ourProduct
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>

        <View style={styles.modalContent}>

          <View style={styles.header}>
            <CustomText variant="h5" fontFamily={Fonts.Bold}>
              Compare Prices
            </CustomText>

            <TouchableOpacity onPress={onClose}>
              <X size={28} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>Platform</Text>
              </View>
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>Price</Text>
              </View>
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>Delivery</Text>
              </View>
            </View>

            <View style={[styles.row, styles.paltanRow]}>
              <View style={styles.cell}>
                <Text style={styles.paltanText}>PALTAN</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.paltanText}>{ourProduct.price}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.paltanText}>{ourProduct.deliveryCharges}</Text>
              </View>
            </View>

            {comparisonData.map((item, index) => (
              <View key={index} style={styles.row}>
                <View style={styles.cell}>
                  <Text>{item.platform}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{item.price}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{item.deliveryCharges}</Text>
                </View>
              </View>
            ))}

          </View>

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
    maxWidth: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 6,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 45,
    alignItems: 'center',
  },

  headerCell: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16,
    backgroundColor: '#f3f3f3',
  },

  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',  
  },

  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  paltanRow: {
    backgroundColor: '#fff9d9',
  },

  paltanText: {
    fontWeight: '700',
    color: '#333',
  },
});

export default ComparisonModal;
