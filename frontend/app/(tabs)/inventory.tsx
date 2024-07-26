import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { InventoryItem } from '/Users/diegomarques/Desktop/medi-club/frontend/components/InventoryComponents'

type InventoryItemType = {
  id: string;
  name: string;
  schedule: string;
  time: string;
  quantity: number;
  image: string;
};

const dummyInventory: InventoryItemType[] = [
  { id: '1', name: 'Item 1', schedule: 'MWF', time: '1:00 PM', quantity: 5, image: '/Users/diegomarques/Desktop/medi-club/frontend/assets/images/pill.png' },
  { id: '2', name: 'Item 2', schedule: 'MWF', time: '1:00 PM', quantity: 3, image: '/Users/diegomarques/Desktop/medi-club/frontend/assets/images/pill.png' },
  { id: '3', name: 'Item 3', schedule: 'MWF', time: '1:00 PM', quantity: 8, image: '/Users/diegomarques/Desktop/medi-club/frontend/assets/images/pill.png' },
];

const InventoryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Inventory</Text>
      <FlatList
        data={dummyInventory}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => <InventoryItem item={item} />}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.addButton}>
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
});

export default InventoryScreen;