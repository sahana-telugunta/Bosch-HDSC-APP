import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { MultiSelect } from 'react-native-element-dropdown';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';   // ← icon library

export default function IncidentScreen({ navigation }) {
  const [incidentArea, setIncidentArea] = useState('');
  const [category, setCategory] = useState('Select Category');
  const [description, setDescription] = useState('');
  const [uploadImage, setUploadImage] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [reportingPersons, setReportingPersons] = useState([]);
  

  const peopleOptions = [
    { label: 'John Doe' },
    { label: 'Sahana Main' },
    { label: 'Alice Kumar' },
    { label: 'Bob Reddy' },
  ];

  /* ───── Image pick & camera helpers ───── */
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
      setUploadImage(result.assets[0].base64);
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
      setCameraImage(result.assets[0].base64);
      setUploadImage(null);
    }
  };

  /* ───── Submit handler ───── */
  const handleSubmit = async () => {
    if (!incidentArea || !category || !description || reportingPersons.length === 0) {
      Alert.alert('Error', 'Please fill all fields and select at least one reporter.');
      return;
    }
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const finalImage = uploadImage || cameraImage;
      await axios.post('http://192.168.29.135:5000/api/incidents', {
        incidentArea,
        category,
        description,
        imageBase64: finalImage,
        email,
        reportingPersons,
      });
      Alert.alert('Success', 'Incident submitted!');
      // reset form
      setIncidentArea('');
      setCategory('HSE Incident');
      setDescription('');
      setUploadImage(null);
      setCameraImage(null);
      setReportingPersons([]);
    } catch (error) {
      console.error('❌ Error submitting incident:', error);
      Alert.alert('Error', 'Failed to submit incident');
    }
  };

  /* ───── Logout helper ───── */
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userEmail');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  /* ───── UI ───── */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
    <TouchableOpacity style={[styles.backBtn, { marginTop: 20 }]}onPress={() => {
      Alert.alert(
        'Confirm Logout',
        'Do you want to logout?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              await AsyncStorage.removeItem('isLoggedIn');
              await AsyncStorage.removeItem('userEmail');
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            },
          },
        ],
        { cancelable: true }
      );
    }}>
      <Ionicons name="arrow-back" size={24} color="#005A9C" />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>


      <Text style={styles.title}>Incident Reporting</Text>

      {/* Image upload / camera */}
      <Text style={styles.label}>Incident Image:</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      {uploadImage && (
        <View style={styles.imagePreviewWrapper}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${uploadImage}` }}
            style={styles.previewImage}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => setUploadImage(null)}
          >
            <Text style={styles.removeButtonText}>❌</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>
      {cameraImage && (
        <View style={styles.imagePreviewWrapper}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${cameraImage}` }}
            style={styles.previewImage}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              setUploadImage(null);
              setCameraImage(null);
            }}
          >
            <Text style={styles.removeButtonText}>❌</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Incident fields */}
      <Text style={styles.label}>Incident Area:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter area"
        value={incidentArea}
        onChangeText={setIncidentArea}
      />

      <Text style={styles.label}>Category:</Text>

<View style={styles.pickerWrapper}>
  <Picker
    selectedValue={category}
    onValueChange={setCategory}
  >
    <Picker.Item label="Select Category" value="" />
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

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Buttons */}
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

/* ───── Styles ───── */
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
backBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 5,
},
backText: {
  marginLeft: 6,
  fontSize: 16,
  color: '#005A9C',
  fontWeight: 'bold',
},
  title: {
    fontSize: 22,
    color: '#005A9C',
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'center',
  },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
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
    marginVertical: 4,
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginBottom: 10,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 10,
    elevation: 5,
  },
  removeButtonText: { fontSize: 12, color: '#ff0000', fontWeight: 'bold' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginBottom: 8,
  },
  multiSelect: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  selectedStyle: { backgroundColor: '#d1e7ff' },
  button: {
    backgroundColor: '#005A9C',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
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
    marginTop: 16,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
});
