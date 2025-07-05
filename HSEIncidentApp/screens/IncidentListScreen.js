import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // for back arrow icon

export default function IncidentListScreen({ navigation }) {
  const [incidents, setIncidents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    console.log('📥 Fetching incidents for:', email);

    try {
      const response = await axios.get(`http://192.168.29.135:5000/api/incidents/${email}`);

      const sorted = response.data
        .filter((item, index, self) => index === self.findIndex(i => i._id === item._id))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setIncidents(sorted);
      applyFilters(sorted, selectedCategory, selectedDateRange);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching incidents:', error);
      setLoading(false);
    }
  };

  const applyFilters = (data, category, dateRange) => {
    let result = data;

    if (category !== 'All') {
      result = result.filter((item) => item.category === category);
    }

    if (dateRange !== 'All') {
      const now = new Date();
      result = result.filter((item) => {
        const date = new Date(item.timestamp);
        if (dateRange === 'Today') {
          return date.toDateString() === now.toDateString();
        }
        if (dateRange === 'This Week') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return date >= oneWeekAgo && date <= now;
        }
        if (dateRange === 'This Month') {
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        }
        return true;
      });
    }

    setFiltered(result);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    applyFilters(incidents, value, selectedDateRange);
  };

  const handleDateChange = (value) => {
    setSelectedDateRange(value);
    applyFilters(incidents, selectedCategory, value);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        Incident {index + 1} on {new Date(item.timestamp).toLocaleString()}
      </Text>

      <Text style={styles.label}>📷 Incident Image:</Text>
      {item.imageBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
          style={styles.image}
        />
      ) : (
        <Text style={{ fontStyle: 'italic' }}>No image submitted</Text>
      )}

      <Text style={styles.label}>📍 Area:</Text>
      <Text>{item.location || item.incidentArea}</Text>

      <Text style={styles.label}>📂 Category:</Text>
      <Text>{item.category}</Text>

      <Text style={styles.label}>👥 Reported To:</Text>
      <Text>{item.reportingPersons?.join(', ') || 'None'}</Text>

      <Text style={styles.label}>📝 Comments:</Text>
      <Text>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
    <TouchableOpacity style={[styles.backBtn, { marginTop: 20 }]} onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="#005A9C" />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>


      <Text style={styles.heading}>Your Reported Incidents</Text>
      <Text style={styles.countText}>Total: {filtered.length} incidents</Text>

      <Text style={styles.label}>Filter by Category:</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={selectedCategory} onValueChange={handleCategoryChange}>
          <Picker.Item label="All" value="All" />
          <Picker.Item label="HSE Incident" value="HSE Incident" />
          <Picker.Item label="5S" value="5S" />
        </Picker>
      </View>

      <Text style={styles.label}>Filter by Date:</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={selectedDateRange} onValueChange={handleDateChange}>
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Today" value="Today" />
          <Picker.Item label="This Week" value="This Week" />
          <Picker.Item label="This Month" value="This Month" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#005A9C" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#005A9C',
    alignSelf: 'center',
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'center',
    marginBottom: 10,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f1f8e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  label: { fontWeight: 'bold', marginTop: 6 },
  image: {
    width: '100%',
    height: 180,
    marginTop: 10,
    borderRadius: 8,
  },
});
