import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

type InventoryItemType = {
  id: string;
  name: string;
  schedule: string;
  time: string;
  quantity: number;
  image: string;
};

type InventoryItemProps = {
  item: InventoryItemType;
};

export const CompletedItem = ({ item }: InventoryItemProps) => (
  <View style={styles.itemContainer}>
    <Image source={{ uri: item.image }} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>Completed</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#4E8415',
    borderRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  itemImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
    paddingRight: 15,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  itemQuantity: {
    fontSize: 14,
    color: 'white',
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});