import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { InventoryItem } from '../../components/InventoryComponents'; // Import the InventoryItem component

type InventoryItemType = {
  id: string;
  name: string;
  schedule: string;
  time: string;
  quantity: number;
  image: string;
};

const InventoryScreen = () => {
  const navigation = useNavigation();
  const [inventory, setInventory] = useState<InventoryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchInventory();
    }, [])
  );

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3456/get-inventory-items', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      } else {
        const errData = await response.json();
        setError(errData.error);
      }
    } catch (error) {
      setError('An error occurred while fetching inventory items');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItemPress = () => {
    router.replace("/new") // Navigate to the "New" screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Inventory</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={inventory}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => <InventoryItem item={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddItemPress}>
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 45,
    marginLeft: 20,
  },
  addButton: {
    backgroundColor: '#4E8415',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 12,
    marginRight: 12,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
});

export default InventoryScreen;