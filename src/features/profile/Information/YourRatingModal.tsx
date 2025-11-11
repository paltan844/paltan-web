import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@utils/Constants';

interface YourRatingModalProps {
  visible: boolean;
  onClose: () => void;
}

const YourRatingModal: React.FC<YourRatingModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Understanding Your Rating</Text>

            <Text style={styles.description}>
              To ensure smooth and respectful interactions within the Paltan delivery ecosystem,
              our courier partners may rate your experience after every delivery. Just like you rate them,
              they can also provide feedback based on their delivery experience with you.
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accurate Address</Text>
              <Text style={styles.sectionDesc}>
                Ensure your address, pin code, and nearby landmarks are accurate to help the courier partner deliver faster and avoid delays.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Same-Day Availability</Text>
              <Text style={styles.sectionDesc}>
                Be available at the delivery address during your selected slot to ensure smooth and timely delivery.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Politeness</Text>
              <Text style={styles.sectionDesc}>
                Being respectful, answering calls, and coordinating kindly during delivery helps build a better delivery ecosystem.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Feedback & Support</Text>
              <Text style={styles.sectionDesc}>
                You can rate the delivery experience, but also understand that delivery partners may provide ratings based on interaction, wait time, or cooperation.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How is your rating calculated?</Text>
              <Text style={styles.sectionDesc}>
                Your customer rating appears once you’ve completed at least 5 orders. It’s the average of all ratings given by delivery partners.
              </Text>
              <Text style={styles.sectionDesc}>
                Maintaining a good rating ensures you enjoy priority services, better support, and faster deliveries.
              </Text>
            </View>

            <TouchableOpacity style={styles.okayButton} onPress={onClose}>
              <Text style={styles.okayText}>Okay</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default YourRatingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: Colors.color,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#555',
  },
  okayButton: {
    backgroundColor: Colors.color,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  okayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
