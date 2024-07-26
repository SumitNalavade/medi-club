import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Link, router } from 'expo-router';

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

  const renderInventoryItem = ({ item }: { item: InventoryItemType }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSchedule}>{item.schedule}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
    </View>
  );

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
          renderItem={renderInventoryItem}
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
    flex: 1,
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
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSchedule: {
    fontSize: 16,
    color: '#666',
  },
  itemTime: {
    fontSize: 16,
    color: '#666',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
});

export default InventoryScreen;
