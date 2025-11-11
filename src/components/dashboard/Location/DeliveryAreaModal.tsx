import React, { FC, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectPincode: (pincode: string) => void;
  STATES: string[];
  DISTRICTS: Record<string, string[]>;
  PINCODES: Record<string, string[]>;
};

const DeliveryAreaModal: FC<Props> = ({ visible, onClose, onSelectPincode, STATES, DISTRICTS, PINCODES }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const reset = () => {
    setSelectedState(null);
    setSelectedDistrict(null);
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={() => { reset(); onClose(); }}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Select Delivery Area</Text>
            <TouchableOpacity onPress={() => { reset(); onClose(); }}>
              <Text style={styles.close}>✖</Text>
            </TouchableOpacity>
          </View>

          {!selectedState && (
            <FlatList
              data={STATES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.listItem} onPress={() => setSelectedState(item)}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

       {selectedState && !selectedDistrict && (
  DISTRICTS[selectedState]?.length > 0 ? (
    <FlatList
      data={DISTRICTS[selectedState]}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => setSelectedDistrict(item)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      )}
    />
  ) : (
    <Text style={styles.noDataText}>No Districts Found</Text>
  )
)}

{selectedDistrict && (
  PINCODES[selectedDistrict]?.length > 0 ? (
    <FlatList
      data={PINCODES[selectedDistrict]}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => {
          onSelectPincode(item);
          reset();
          onClose();
        }}>
          <Text>{item}</Text>
        </TouchableOpacity>
      )}
    />
  ) : (
    <Text style={styles.noDataText}>No Pincodes Found</Text>
  )
)}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '85%', backgroundColor: '#fff', borderRadius: 10, padding: 16, maxHeight: '80%' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerText: { fontWeight: 'bold', fontSize: 16 },
  close: { fontSize: 18, color: 'red' },
  noDataText: { textAlign: 'center', padding: 16, color: '#666' },
  listItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
});

export default DeliveryAreaModal;
