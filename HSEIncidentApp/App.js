import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import IncidentScreen from './screens/IncidentScreen';
import IncidentListScreen from './screens/IncidentListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const status = await AsyncStorage.getItem('isLoggedIn');
      setInitialRoute(status === 'true' ? 'Incident' : 'Login');
    };
    checkLogin();
  }, []);

  if (!initialRoute) return null; // Wait for AsyncStorage

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Incident" component={IncidentScreen} />
        <Stack.Screen name="IncidentList" component={IncidentListScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}




















// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';

// export default function App() {
//   const [location, setLocation] = useState('');
//   const [category, setCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');
//   const [comment, setComment] = useState('');
//   const [image, setImage] = useState(null);

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (permission.status !== 'granted') {
//       Alert.alert('Permission required', 'Please allow photo access');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!location || !category || !subCategory || !comment) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }

//     try {
//       const response = await axios.post('http://192.168.29.135:5000/api/incidents', {
//         location,
//         category,
//         subCategory,
//         comment,
//         imageUrl: image, // optional for now
//       });

//       Alert.alert('Success', 'Incident submitted!');
//       setLocation('');
//       setCategory('');
//       setSubCategory('');
//       setComment('');
//       setImage(null);
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to submit incident');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Report HSE/5S Incident</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Location"
//         value={location}
//         onChangeText={setLocation}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Category (e.g. HSE or 5S)"
//         value={category}
//         onChangeText={setCategory}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Sub-category"
//         value={subCategory}
//         onChangeText={setSubCategory}
//       />

//       <TextInput
//         style={[styles.input, { height: 80 }]}
//         placeholder="Comments"
//         value={comment}
//         onChangeText={setComment}
//         multiline
//       />

//       <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
//         <Text style={styles.buttonText}>Upload Image</Text>
//       </TouchableOpacity>

//       {image && <Image source={{ uri: image }} style={styles.previewImage} />}

//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Submit Incident</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 50,
//     paddingBottom: 50,
//     paddingHorizontal: 20,
//     backgroundColor: '#fff',
//     alignItems: 'stretch',
//   },
//   title: {
//     fontSize: 24,
//     color: '#005A9C',
//     fontWeight: 'bold',
//     marginBottom: 20,
//     alignSelf: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#aaa',
//     padding: 12,
//     borderRadius: 6,
//     marginBottom: 12,
//   },
//   imageButton: {
//     backgroundColor: '#6A1B9A',
//     padding: 12,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: '#005A9C',
//     padding: 14,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   previewImage: {
//     width: '100%',
//     height: 180,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
// });

