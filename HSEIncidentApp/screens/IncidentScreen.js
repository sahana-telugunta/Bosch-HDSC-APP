import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { MultiSelect } from 'react-native-element-dropdown';
import axios from 'axios';

export default function IncidentScreen({ navigation }) {
  const [incidentArea, setIncidentArea] = useState('');
  const [category, setCategory] = useState('HSE Incident');
  const [comment, setComment] = useState('');
  const [uploadImage, setUploadImage] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [reportingPersons, setReportingPersons] = useState([]);
  const [email, setEmail] = useState('');

  const peopleOptions = [
    { label: 'John Doe' },
    { label: 'Sahana Main' },
    { label: 'Alice Kumar' },
    { label: 'Bob Reddy' },
  ];

  useEffect(() => {
    AsyncStorage.getItem('userEmail').then(setEmail);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow access to media library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      setUploadImage(selected.base64);
      setCameraImage(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      setCameraImage(selected.base64);
      setUploadImage(null);
    }
  };

  const handleSubmit = async () => {
    if (!incidentArea || !category || !comment || reportingPersons.length === 0) {
      Alert.alert('Error', 'Please fill all fields and select at least one reporter.');
      return;
    }

    try {
      const finalImage = uploadImage || cameraImage;

      const response = await axios.post('http://192.168.29.135:5000/api/incidents', {
        incidentArea,
        category,
        comment,
        imageBase64: finalImage,
        email,
        reportingPersons,
      });

      Alert.alert('Success', 'Incident submitted!');
      setIncidentArea('');
      setCategory('HSE Incident');
      setComment('');
      setUploadImage(null);
      setCameraImage(null);
      setReportingPersons([]);
    } catch (error) {
      console.error('❌ Error submitting incident:', error);
      Alert.alert('Error', 'Failed to submit incident');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userEmail');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>HSE Incident Reporting</Text>

      <Text style={styles.emailLabel}>Logged in as: {email}</Text>

      <Text style={styles.label}>Incident Image:</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      {uploadImage && (
        <Image source={{ uri: `data:image/jpeg;base64,${uploadImage}` }} style={styles.previewImage} />
      )}

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>
      {cameraImage && (
        <Image source={{ uri: `data:image/jpeg;base64,${cameraImage}` }} style={styles.previewImage} />
      )}

      <Text style={styles.label}>Incident Area:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter area"
        value={incidentArea}
        onChangeText={setIncidentArea}
      />

      <Text style={styles.label}>Category:</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={category} onValueChange={setCategory}>
          <Picker.Item label="HSE Incident" value="HSE Incident" />
          <Picker.Item label="5S" value="5S" />
        </Picker>
      </View>

      <Text style={styles.label}>Reporting Person(s):</Text>
      <MultiSelect
        style={styles.multiSelect}
        data={peopleOptions}
        labelField="label"
        valueField="label"
        placeholder="Select people"
        value={reportingPersons}
        onChange={setReportingPersons}
        selectedStyle={styles.selectedStyle}
      />

      <Text style={styles.label}>Comments:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter comments"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Incident</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.listButton}
        onPress={() => navigation.navigate('IncidentList')}
      >
        <Text style={styles.buttonText}>View All Incidents</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    color: '#005A9C',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  emailLabel: {
    color: '#555',
    fontStyle: 'italic',
    alignSelf: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#6A1B9A',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 10,
  },
  orText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginBottom: 10,
  },
  multiSelect: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  selectedStyle: {
    backgroundColor: '#d1e7ff',
  },
  button: {
    backgroundColor: '#005A9C',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listButton: {
    backgroundColor: '#00796B',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutBtn: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
