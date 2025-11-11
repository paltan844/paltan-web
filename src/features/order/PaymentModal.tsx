import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (method: 'cod' | 'online') => void;
  selected: 'cod' | 'online';
}

const PaymentSelectModal: React.FC<Props> = ({ visible, onClose, onSelect, selected }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <CustomText variant="h6" style={{ marginBottom: 15 }}>
            Select Payment Method
          </CustomText>

          <TouchableOpacity
            style={[styles.option, selected === 'cod' && styles.selected]}
            onPress={() => {
              onSelect('cod');
              onClose();
            }}
          >
            <CustomText style={styles.optionText}>💵 Cash on Delivery</CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selected === 'online' && styles.selected]}
            onPress={() => {
              onSelect('online');
              onClose();
            }}
          >
            <CustomText style={styles.optionText}>💳 Online Payment</CustomText>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <CustomText style={{ color: Colors.danger }}>Cancel</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selected: {
    backgroundColor: '#eafaf1',
  },
  optionText: {
    fontFamily: Fonts.SemiBold,
  },
  cancelBtn: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default PaymentSelectModal;
