import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { InventoryItem } from '../../components/InventoryComponents';

type MedicationType = {
  id: string;
  name: string;
  time: string;
  quantity: string;
  completed: boolean;
};

const medications: MedicationType[] = [
  { id: '1', name: 'Metformin', time: 'Completed', quantity: '', completed: true },
  { id: '2', name: 'Levothyroxine', time: '1:00 PM', quantity: '1 Pill', completed: false },
  { id: '3', name: 'Omeprazole', time: '1:15 PM', quantity: '1 Pill', completed: false },
  { id: '4', name: 'Simvastatin', time: '5:00 PM', quantity: '1 Pills', completed: false },
];

const HomeScreen = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.name}>Kathryn</Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.progress}>1 of 4 completed</Text>
          </View>
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage Inventory</Text>
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.weightlifterImage}
          />
        </View>

        <Text style={styles.sectionTitle}>Daily Review</Text>
        
        {medications.map((med) => (
          <InventoryItem
            key={med.id}
            item={{
              id: med.id,
              name: med.name,
              schedule: med.time,
              time: med.quantity,
              quantity: 0,
              image: '',
            }}
        
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 45,
    marginLeft: 20,
  },
  name: {
    fontSize: 32,
    marginBottom: 20,
    marginLeft: 20,
  },
  summaryCard: {
    backgroundColor: '#FFF9E5',
    borderRadius: 25,
    padding: 20,
    marginVertical: 30,
    marginHorizontal: 15,
  },
  dateContainer: {
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progress: {
    fontSize: 14,
    color: '#666',
  },
  manageButton: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
  },
  manageButtonText: {
    color: '#FF9500',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  weightlifterImage: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 100,
    height: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default HomeScreen;