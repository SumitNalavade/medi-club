import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert, FlatList, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [drugImage, setDrugImage] = useState('');
  const [description, setDescription] = useState('');
  const [warnings, setWarnings] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setNotificationTime(selectedTime);
    }
  };

  const handlePillNameChange = async (name: string) => {
    setPillName(name);
    setDrugImage('');
    setDescription('');
    setWarnings('');
    setError('');

    if (name.length > 2) {
      await fetchDrugSuggestions(name);
    } else {
      setSuggestions([]);
    }
  };

  const fetchDrugSuggestions = async (query: string) => {
    try {
      const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${query}*&limit=10`);
      const data = await response.json();
      const results = data.results?.map((drug: any) => drug.openfda.brand_name?.[0]) || [];
      setSuggestions(results);
    } catch (error) {
      setSuggestions([]);
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchDrugInfo = async (name: string) => {
    try {
      const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${name}"&limit=1`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const drug = data.results[0];
        setDrugImage(drug.openfda.image_url ? drug.openfda.image_url[0] : 'default-image-url');
        setDescription(drug.description ? drug.description[0] : 'No description available');
        setWarnings(drug.warnings ? drug.warnings[0] : 'No warnings available');
        setError('');
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
    fetchDrugInfo(suggestion);
  };

  const handleSubmit = async () => {
    const schedule = selectedDays.map(day => day.substring(0, 2)).join('');
    const plan = {
      name: pillName,
      schedule,
      time: notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quantity: parseInt(amount, 10),
      image: drugImage || 'default-image-url',
    };
    console.log(plan);
    try {
      const response = await fetch('http://localhost:3456/add-inventory-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Inventory item added successfully!');
      } else {
        Alert.alert('Error', 'Error adding inventory item');
        console.error('Error:', data);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the inventory item');
      console.error('Error:', error);
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
      <Text style={styles.suggestionItem}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => { }}>
              <Text style={styles.backButtonText}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Add Plan</Text>
            <Text style={styles.label}>Pills name</Text>
            <View style={styles.autocompleteContainer}>
              <Autocomplete
                data={suggestions}
                defaultValue={pillName}
                onChangeText={handlePillNameChange}
                flatListProps={{
                  keyExtractor: (_, idx) => idx.toString(),
                  renderItem: renderItem,
                }}
                inputContainerStyle={styles.autocompleteInputContainer}
                listContainerStyle={styles.autocompleteListContainer}
              />
            </View>
            <Button title="Search" onPress={() => fetchDrugInfo(pillName)} />
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <View style={styles.drugInfoContainer}>
                {drugImage ? <Image source={{ uri: drugImage }} style={styles.drugImage} /> : null}
                <TruncatedText text={description} maxLength={100} />
                <TruncatedText text={warnings} maxLength={100} />
              </View>
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
          </View>
        }
        renderItem={null}
        keyExtractor={() => 'dummy'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingHorizontal: 20,
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
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1,  // Ensure the autocomplete container is above other elements
    marginBottom: 20,
  },
  suggestionItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;
