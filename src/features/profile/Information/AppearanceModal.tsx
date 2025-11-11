import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Colors } from '@utils/Constants';

interface AppearanceModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTheme: 'light' | 'dark';
  onSelectTheme: (theme: 'light' | 'dark') => void;
}

const AppearanceModal: React.FC<AppearanceModalProps> = ({
  visible,
  onClose,
  selectedTheme,
  onSelectTheme,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Theme</Text>

          <TouchableOpacity
            style={[
              styles.themeOption,
              selectedTheme === 'light' && styles.selectedOption,
            ]}
            onPress={() => onSelectTheme('light')}
          >
            <Text style={styles.optionText}>Light Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              selectedTheme === 'dark' && styles.selectedOption,
            ]}
            onPress={() => {
              Alert.alert('Dark theme is currently not available.');
            }}
          >
            <Text style={styles.optionText}>Dark Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AppearanceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  themeOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#e6ffe6',
    borderColor: Colors.color,
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.color,
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
