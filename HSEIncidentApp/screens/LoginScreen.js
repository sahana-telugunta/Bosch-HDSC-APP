import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async () => {
  console.log('🔑 Login button pressed');

  if (!email || !password) {
    Alert.alert('Error', 'Please enter email and password');
    return;
  }

  try {
    console.log('📡 Sending login request...');
    const response = await axios.post('http://192.168.29.135:5000/api/auth/login', {
      email,
      password
    });

    console.log('✅ Server responded:', response.data);

    if (response.data.token) {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('userEmail', email);
      console.log('🔐 AsyncStorage saved. Navigating...');

      navigation.replace('Incident');
    } else {
      Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    Alert.alert('Login Failed', 'Network or server error');
  }
};


  return (
    <View style={styles.container}>
      {/* Bosch Logo */}
      <Image source={require('../assets/bosch-logo.png')} style={styles.logo} />

      <Text style={styles.title}>Bosch HSE Incident Reporting</Text>

      <TextInput
        placeholder="Corporate Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup link */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>For Bosch internal use only</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 180,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: '#005A9C',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
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
  link: {
    marginTop: 20,
    color: '#005A9C',
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    color: '#888',
  },
});







// // import React, { useState } from 'react';
// // import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// // import axios from 'axios';

// // export default function LoginScreen({ navigation }) {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');

// //   const handleLogin = async () => {
// //     if (!email || !password) {
// //       Alert.alert('Error', 'Please enter email and password');
// //       return;
// //     }

// //     try {
// //       const response = await axios.post('http://192.168.29.135:5000/api/auth/login', {
// //         email,
// //         password
// //       });

// //       // Optionally store the token: response.data.token
// //       Alert.alert('Success', 'Login successful');

// //       // Navigate to Incident screen
// //       navigation.replace('Incident');
// //     } catch (error) {
// //       console.error(error);
// //       Alert.alert('Login Failed', 'Invalid email or password');
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Login</Text>

// //       <TextInput
// //         placeholder="Email"
// //         value={email}
// //         onChangeText={setEmail}
// //         autoCapitalize="none"
// //         keyboardType="email-address"
// //         style={styles.input}
// //       />

// //       <TextInput
// //         placeholder="Password"
// //         value={password}
// //         onChangeText={setPassword}
// //         secureTextEntry
// //         style={styles.input}
// //       />

// //       <TouchableOpacity style={styles.button} onPress={handleLogin}>
// //         <Text style={styles.buttonText}>Login</Text>
// //       </TouchableOpacity>

// //       {/* Optional Signup redirect */}
// //       {/* <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
// //         <Text style={styles.link}>Don't have an account? Sign up</Text>
// //       </TouchableOpacity> */}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 30,
// //     justifyContent: 'center',
// //     backgroundColor: '#fff',
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     marginBottom: 30,
// //     textAlign: 'center',
// //     color: '#005A9C',
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 6,
// //     padding: 12,
// //     marginBottom: 15,
// //   },
// //   button: {
// //     backgroundColor: '#005A9C',
// //     padding: 15,
// //     borderRadius: 6,
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// //   link: {
// //     color: '#005A9C',
// //     textAlign: 'center',
// //   },
// // });
