import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface UpdateModalProps {
  visible: boolean;
  forceUpdate: boolean;
  onUpdate: () => void;
  onSkip?: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  forceUpdate,
  onUpdate,
  onSkip,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>🚀 Update Available</Text>
          <Text style={styles.message}>
            A new version of the app is available. Please update to continue enjoying all features.
          </Text>

          <View style={styles.actions}>
            {!forceUpdate && (
              <TouchableOpacity style={[styles.button, styles.laterBtn]} onPress={onSkip}>
                <Text style={[styles.buttonText, styles.laterText]}>Later</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.button, styles.updateBtn]} onPress={onUpdate}>
              <Text style={[styles.buttonText, styles.updateText]}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  laterBtn: {
    backgroundColor: '#f0f0f0',
  },
  updateBtn: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  laterText: {
    color: '#555',
  },
  updateText: {
    color: '#fff',
  },
});

export default UpdateModal;
