import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

interface AddressSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  address: {
    [key: string]: any;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
}

const AddressSummaryModal: React.FC<AddressSummaryModalProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  address,
}) => {
  const getValue = (val: any) => (val?.trim?.() ? val.trim() : 'N/A');

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/ (\w)/g, (_, c) => ` ${c.toUpperCase()}`);
  };

  const isEmptyAddress =
    !address ||
    Object.keys(address).length === 0 ||
    !address.address?.trim();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.headerText}>📋 Address Summary</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {Object.entries(address || {})
                  .filter(([key]) => key !== 'latitude' && key !== 'longitude')
                  .map(([key, val]) => (
                    <View key={key} style={styles.row}>
                      <Text style={styles.keyText}>{formatKey(key)}:</Text>
                      <Text style={styles.valueText}>{getValue(val)}</Text>
                    </View>
                  ))}
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.editBtn, !isEmptyAddress && { opacity: 0.4 }]}
                  onPress={() => isEmptyAddress && onEdit()}
                  disabled={!isEmptyAddress}
                >
                  <Text style={styles.btnText}>✏️ Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteButton, !isEmptyAddress && { opacity: 0.4 }]}
                  disabled={!isEmptyAddress}
                  onPress={() => isEmptyAddress && onDelete()}
                >
                  <Text style={styles.btnText}>🗑️ Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <Text style={styles.btnText}>❌ Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
    elevation: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  keyText: {
    fontWeight: '600',
    color: '#555',
    width: '45%',
  },
  valueText: {
    color: '#222',
    width: '50%',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editBtn: {
    backgroundColor: '#00BA3C',
    flex: 1,
    marginRight: 3,
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E53935',
    flex: 1,
    marginHorizontal: 3,
    padding: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeBtn: {
    backgroundColor: '#FF5C5C',
    flex: 1,
    marginLeft: 6,
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddressSummaryModal;
