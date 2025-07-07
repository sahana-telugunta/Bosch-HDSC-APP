// screens/SignupScreen.js

import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://192.168.29.135:5000/api/auth/signup', {
        email,
        password,
      });
      Alert.alert('Success', 'Account created! Please login.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Signup failed. Email may already exist.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/bosch-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Sign Up - Bosch Incident App</Text>

      <TextInput
        style={styles.input}
        placeholder="Corporate Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={{ position: 'relative' }}>
        <TextInput
          style={styles.input}
          placeholder="Create Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 12, top: 11}}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 12, top: 11}}
          onPress={() => setShowConfirmPassword((prev) => !prev)}
        >
          <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 180, height: 60, resizeMode: 'contain', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, color: '#005A9C', fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 15 },
  button: { backgroundColor: '#005A9C', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 20, color: '#005A9C', textAlign: 'center' },
});
