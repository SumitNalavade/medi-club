import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScheduleItem } from '/Users/diegomarques/Desktop/medi-club/frontend/components/ScheduleComponents'
import { CompletedItem } from '/Users/diegomarques/Desktop/medi-club/frontend/components/CompletedComponents'

type MedicationType = {
  id: string;
  name: string;
  time: string;
  quantity: number;
};

const medications: MedicationType[] = [
  { id: '2', name: 'Levothyroxine', time: '1:00 PM', quantity: 1 },
  { id: '3', name: 'Omeprazole', time: '1:15 PM', quantity: 2 },
  { id: '4', name: 'Simvastatin', time: '5:00 PM', quantity: 3 },
  { id: '5', name: 'Simvastatin', time: '5:00 PM', quantity: 1 },
  { id: '6', name: 'Simvastatin', time: '5:00 PM', quantity: 1 },
  { id: '7', name: 'Simvastatin', time: '5:00 PM', quantity: 1 },

];

const HomeScreen = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.summaryCard}>
          <Image
            source={require('/Users/diegomarques/Desktop/medi-club/frontend/assets/images/weight.png')}
            style={styles.weightlifterImage}
          />
        </View>

        <Text style={styles.sectionTitle}>Daily Review</Text>
        <CompletedItem item = {{ id: '1', schedule: "1", image: '/Users/diegomarques/Desktop/medi-club/frontend/assets/images/check.png', name: 'Metformin', time: 'Completed', quantity: 2 }}></CompletedItem>
        {medications.map((med) => (
          <ScheduleItem
            key={med.id}
            item={{
              id: med.id,
              name: med.name,
              schedule: med.time,
              time: med.time,
              quantity: med.quantity,
              image: '/Users/diegomarques/Desktop/medi-club/frontend/assets/images/pill.png',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginVertical: 185,
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
    right: -15,
    bottom: -170,
    width: 415,
    height: 360,
  },
  sectionTitle: {
    fontSize: 25,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 5,
  },
});

export default HomeScreen;