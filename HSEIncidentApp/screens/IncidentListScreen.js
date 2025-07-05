import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
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
      console.log('📦 Fetched incidents:', response.data);
      setIncidents(response.data);
    } catch (error) {
      console.error('❌ Error fetching incidents:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.label}>📍 Location:</Text>
      <Text>{item.location}</Text>

      <Text style={styles.label}>🗂 Category:</Text>
      <Text>{item.category} - {item.subCategory}</Text>

      <Text style={styles.label}>📝 Comment:</Text>
      <Text>{item.comment}</Text>

        {item.imageBase64 && (
        <Image
            source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
            style={styles.image}
        />
        )}

    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Reported Incidents</Text>
      <FlatList
        data={incidents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#005A9C' },
  item: {
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginBottom: 15,
  },
  label: { fontWeight: 'bold', marginTop: 5 },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  noImage: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#777',
  },
});






// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import axios from 'axios';

// export default function IncidentListScreen({ navigation }) {
//   const [incidents, setIncidents] = useState([]);

//   useEffect(() => {
//     fetchIncidents();
//   }, []);

// useEffect(() => {
//   fetchIncidents();
// }, []);

// const fetchIncidents = async () => {
//   const email = await AsyncStorage.getItem('userEmail');
//   console.log('📥 Fetching incidents for:', email);

//   try {
//     const response = await axios.get(`http://192.168.29.135:5000/api/incidents/${email}`);
//     console.log('📦 Fetched incidents:', response.data);
//     setIncidents(response.data);
//   } catch (error) {
//     console.error('❌ Error fetching incidents:', error);
//   }
// };


//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.title}>{item.category} - {item.subCategory}</Text>
//       <Text style={styles.label}>Location: {item.location}</Text>
//       <Text style={styles.label}>Comments: {item.comment}</Text>
//       {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>All Reported Incidents</Text>
//       <FlatList
//         data={incidents}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#005A9C' },
//   card: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 10 },
//   title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//   label: { marginTop: 4, color: '#555' },
//   image: { width: '100%', height: 150, marginTop: 8, borderRadius: 6 },
// });
