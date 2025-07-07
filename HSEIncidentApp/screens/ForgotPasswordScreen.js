// screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // for back arrow icon

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      await axios.post('http://192.168.29.135:5000/api/auth/forgot-password', { email });
      Alert.alert('Success', 'Reset code sent to your email');
      navigation.navigate('ResetPassword', { email }); // go to next screen
    } catch (error) {
      console.error('Error sending code:', error);
      Alert.alert('Error', 'Could not send reset code');
    }
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity style={[styles.backBtn, { marginTop: 20 }]} onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="#005A9C" />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        placeholder="Enter your registered email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>Send Reset Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: {     fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#005A9C', 
    alignSelf: 'center',
    marginBottom:20
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#005A9C',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 15,
  },
  button: {
    backgroundColor: '#005A9C', padding: 14, borderRadius: 6, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
