import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PermissionsAndroid } from 'react-native';
import Vosk from 'react-native-vosk'; // Ensure Vosk is imported

interface MicrophoneProps {
  onSpeechResult: (text: string) => void;
  startMic?: boolean;
}

const Microphone: React.FC<MicrophoneProps> = ({ onSpeechResult, startMic = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const handleMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startListening = async () => {
    if (!isModelLoaded) {
      Alert.alert('⏳ Model Loading', 'Model is still downloading. Please wait.');
      return;
    }

    try {
      const hasPermission = await handleMicrophonePermission();
      if (!hasPermission) return;

      setIsListening(true);
      // Start listening with Vosk
      Vosk.startRecognition((result) => {
        setIsListening(false);
        if (result) {
          onSpeechResult(result);
        }
      });
    } catch (error) {
      console.error('❌ Error starting voice recognition:', error);
      setIsListening(false);
    }
  };

  return (
    <TouchableOpacity onPress={startListening} disabled={isListening}>
      <Icon name={isListening ? 'mic-off' : 'mic'} color="black" size={20} />
    </TouchableOpacity>
  );
};

export default Microphone;
