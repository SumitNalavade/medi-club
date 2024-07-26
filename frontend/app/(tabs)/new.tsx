import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Autocomplete from 'react-native-autocomplete-input';
import TruncatedText from '../TruncatedText';
import DaysPicker from '../DaysPicker';

type DrugInfo = {
  image: string;
  description: string;
  warnings: string;
};

const App = () => {
  const [pillName, setPillName] = useState('');
  const [amount, setAmount] = useState('2');
  const [duration, setDuration] = useState('30');
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [foodPillOption, setFoodPillOption] = useState('After');
  const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setNotificationTime(selectedTime);
    }
  };

  const handlePillNameChange = (name: string) => {
    setPillName(name);
    setDrugInfo(null);
    setError('');

    if (name.length > 2) {
      fetchDrugSuggestions(name);
    } else {
      setSuggestions([]);
    }
  };

  const fetchDrugSuggestions = async (query: string) => {
    try {
      const response = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${query}*&limit=10`);
      const results = response.data.results?.map((drug: any) => drug.openfda.brand_name?.[0]) || [];
      setSuggestions(results);
    } catch (error) {
      setSuggestions([]);
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchDrugInfo = async () => {
    try {
      const response = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${pillName}&limit=1`);
      if (response.data.results && response.data.results.length > 0) {
        const drug = response.data.results[0];
        setDrugInfo({
          image: drug.openfda.image_url ? drug.openfda.image_url[0] : 'default-image-url', // Example field, adjust based on actual API response
          description: drug.description ? drug.description[0] : 'No description available',
          warnings: drug.warnings ? drug.warnings[0] : 'No warnings available',
        });
        setSuggestions([]);
      } else {
        setError('Drug not found. Please check the name and try again.');
      }
    } catch (error) {
      setError('Error fetching drug information. Please try again later.');
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setPillName(suggestion);
    setSuggestions([]);
    fetchDrugInfo();
  };

  const handleSubmit = async () => {
    const schedule = selectedDays.map(day => day.substring(0, 2)).join('');
    const plan = {
      name: pillName,
      schedule,
      time: notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quantity: parseInt(amount, 10),
      image: drugInfo ? drugInfo.image : 'default-image-url',
    };

    try {
      const response = await axios.post('http://localhost:3456/add-inventory-item', plan);
      if (response.status === 200) {
        console.log('Inventory item added successfully');
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => { }}>
        <Text style={styles.backButtonText}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Add Medication</Text>
      <Text style={styles.label}>Pills name</Text>
      <Autocomplete
        data={suggestions}
        defaultValue={pillName}
        onChangeText={handlePillNameChange}
        flatListProps={{
          keyExtractor: (_, idx) => idx.toString(),
          renderItem: ({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
              <Text style={styles.suggestionItem}>{item}</Text>
            </TouchableOpacity>
          ),
        }}
        inputContainerStyle={styles.autocompleteInputContainer}
        listContainerStyle={styles.autocompleteListContainer}
      />
      <Button title="Search" onPress={fetchDrugInfo} />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        drugInfo && (
          <View style={styles.drugInfoContainer}>
            {drugInfo.image ? <Image source={{ uri: drugInfo.image }} style={styles.drugImage} /> : null}
            <TruncatedText text={drugInfo.description} maxLength={100} />
            <TruncatedText text={drugInfo.warnings} maxLength={100} />
          </View>
        )
      )}
      <Text style={styles.label}>Amount & How long?</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.smallInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Text style={styles.text}>pills</Text>
        <TextInput
          style={styles.smallInput}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        <Text style={styles.text}>days</Text>
      </View>
      <Text style={styles.label}>Days to take</Text>
      <DaysPicker selectedDays={selectedDays} setSelectedDays={setSelectedDays} />
      <Text style={styles.label}>Food & Pills</Text>
      <View style={styles.foodPillsContainer}>
        {['Before', 'With', 'After'].map(option => (
          <TouchableOpacity
            key={option}
            style={foodPillOption === option ? styles.foodPillButtonSelected : styles.foodPillButton}
            onPress={() => setFoodPillOption(option)}
          >
            <Text style={styles.foodPillText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Notification</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <Text style={styles.timeText}>
          {notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={notificationTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <TouchableOpacity style={styles.doneButton} onPress={handleSubmit}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#006940', // Humana's green color
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006940', // Humana's green color
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    width: 60,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  foodPillsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  foodPillButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FFF',
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  foodPillButtonSelected: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#006940', // Humana's green color
    backgroundColor: '#E5F9E7',
    flex: 1,
    alignItems: 'center',
  },
  foodPillText: {
    fontSize: 18,
    color: '#333',
  },
  timeText: {
    fontSize: 18,
    marginTop: 10,
    color: '#006940', // Humana's green color
  },
  doneButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#006940', // Humana's green color
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 18,
    color: '#FFF',
  },
  drugInfoContainer: {
    marginTop: 20,
  },
  drugImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  drugDescription: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  drugWarnings: {
    fontSize: 14,
    marginTop: 10,
    color: '#cc0000',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  autocompleteInputContainer: {
    borderWidth: 0,
  },
  autocompleteListContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FFF',
  },
  suggestionItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;
