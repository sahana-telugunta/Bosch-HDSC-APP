import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function IncidentScreen({ navigation }) {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);

const pickImage = async () => {
  console.log('📲 Upload Image button clicked');
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow access to media library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ fix deprecation warning
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      console.log('✅ Image selected:', selectedImage.uri);
      setImage(selectedImage.base64); // store base64
    } else {
      console.log('⚠️ No image selected');
    }
  } catch (error) {
    console.error('❌ Error picking image:', error);
    Alert.alert('Error', 'Failed to pick image');
  }
};


const handleSubmit = async () => {
  if (!location || !category || !subCategory || !comment) {
    Alert.alert('Error', 'Please fill all fields');
    return;
  }

  try {
    const email = await AsyncStorage.getItem('userEmail');
    console.log('📤 Submitting incident for', email);

    const response = await axios.post(
      'http://192.168.29.135:5000/api/incidents',
      {
        location,
        category,
        subCategory,
        comment,
        imageBase64: image || null, // ← just send the base‑64 string
        email,
      }
    );

    console.log('✅ Incident submitted:', response.data);
    Alert.alert('Success', 'Incident submitted!');
    // clear form
    setLocation('');
    setCategory('');
    setSubCategory('');
    setComment('');
    setImage(null);
  } catch (error) {
    console.error('❌ Error submitting incident:', error);
    Alert.alert('Error', 'Failed to submit incident');
  }
};




const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userEmail');
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (error) {
    console.error('Logout error:', error);
    Alert.alert('Error', 'Unable to logout.');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report HSE/5S Incident</Text>

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Category (e.g. HSE or 5S)"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Sub-category"
        value={subCategory}
        onChangeText={setSubCategory}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Comments"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      {image && (
  <Image
    source={{ uri: `data:image/jpeg;base64,${image}` }}
    style={styles.previewImage}
  />
)}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Incident</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.listButton} onPress={() => navigation.navigate('IncidentList')}>
        <Text style={styles.buttonText}>View All Incidents</Text>
      </TouchableOpacity>

      {/* ✅ Logout button inside return */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  title: {
    fontSize: 24,
    color: '#005A9C',
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  imageButton: {
    backgroundColor: '#6A1B9A',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
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
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
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

  listButton: {
  backgroundColor: '#00796B',
  padding: 14,
  borderRadius: 6,
  alignItems: 'center',
  marginTop: 12,
},

});
