import React, { FC, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (pincode: string, isAvailable: boolean) => void;
  allowedPincodes: string[];
};

const ManualPincodeModal: FC<Props> = ({ visible, onClose, onSubmit, allowedPincodes }) => {
  const [pincode, setPincode] = useState('');

  const handleSubmit = () => {
    const isAvailable = allowedPincodes.includes(pincode);
    onSubmit(pincode, isAvailable);
    setPincode('');
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Enter Your Pincode</Text>
          <TextInput
            placeholder="Type your pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#00BA3C', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  close: { marginTop: 10, color: 'red', textAlign: 'center' },
});

export default ManualPincodeModal;
