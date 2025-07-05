import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function IncidentListScreen() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    console.log('📥 Fetching incidents for:', email);

    try {
      const response = await axios.get(`http://192.168.29.135:5000/api/incidents/${email}`);
      const sorted = response.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setIncidents(sorted);
    } catch (error) {
      console.error('❌ Error fetching incidents:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.label}>📸 Incident Image:</Text>
      {item.imageBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
          style={styles.image}
        />
      ) : (
        <Text style={styles.noImage}>📷 No image submitted</Text>
      )}

      <Text style={styles.label}>📅 Incident Time:</Text>
      <Text>{new Date(item.timestamp).toLocaleString()}</Text>

      <Text style={styles.label}>📍 Incident Area:</Text>
      <Text>{item.incidentArea || item.location || 'N/A'}</Text>

      <Text style={styles.label}>📂 Category:</Text>
      <Text>{item.category}</Text>

      <Text style={styles.label}>👥 Reported To:</Text>
      <Text>{item.reportingPersons?.length > 0 ? item.reportingPersons.join(', ') : 'None selected'}</Text>

      <Text style={styles.label}>📝 Comments:</Text>
      <Text>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Reported Incidents</Text>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#005A9C' },
  card: {
    backgroundColor: '#f1f8e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  label: { fontWeight: 'bold', marginTop: 6 },
  image: {
    width: '100%',
    height: 180,
    marginBottom: 10,
    borderRadius: 8,
  },
  noImage: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
});
