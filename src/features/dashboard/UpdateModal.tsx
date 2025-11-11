import { getLatestAppVersion } from '@service/productService';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const UpdateModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [versionData, setVersionData] = useState({
    latestVersion: '',
    forceUpdate: false,
    playStoreUrl: '',
  });

  useEffect(() => {
    const checkForUpdate = async () => {
      const currentVersion = DeviceInfo.getVersion();
      const latest = await getLatestAppVersion();
      if (!latest) {return;}

      setVersionData(latest);

      if (currentVersion !== latest.latestVersion) {
        setShowModal(true);
      }
    };

    checkForUpdate();
  }, []);

 const handleUpdate = () => {
    if (versionData.playStoreUrl) {
      Linking.openURL(versionData.playStoreUrl);
    }
  };

  return (
    <Modal visible={showModal} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.message}>
           A new version ({versionData.latestVersion}) is available. Please update to continue.
          </Text>

          <TouchableOpacity onPress={handleUpdate} style={styles.button}>
            <Text style={styles.buttonText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});
