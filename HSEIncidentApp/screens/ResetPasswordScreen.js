// screens/ResetPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // for back arrow icon

export default function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    if (!code || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Enter all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://192.168.29.135:5000/api/auth/reset-password', {
        email,
        code,
        newPassword
      });
      Alert.alert('Success', 'Password reset successfully');
      navigation.replace('Login');
    } catch (error) {
      console.error('Reset error:', error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.backBtn, { marginTop: 20 }]} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#005A9C" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.mailText}>For: {email}</Text>
      <TextInput
        placeholder="Enter 6-digit code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        keyboardType="numeric"
      />
      <View style={{ position: 'relative' }}>
        <TextInput
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 12, top: 18 }}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      <View style={{ position: 'relative' }}>
        <TextInput
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 12, top: 18 }}
          onPress={() => setShowConfirmPassword((prev) => !prev)}
        >
          <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
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
    mailText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 15,
  },
  button: {
    backgroundColor: '#00796B', padding: 14, borderRadius: 6, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
