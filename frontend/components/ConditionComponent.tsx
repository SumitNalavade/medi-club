import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

type SymptomType = {
    id: string;
    symptom: string
    icon: any
    value: string
  };

type ConditionItemProps = {
    symptom: SymptomType
    selected: boolean,
    addSelectedComponent: (symptom: string) => void
};

export const ConditionItem = ({ symptom, selected, addSelectedComponent  }: ConditionItemProps) => (
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 25, paddingVertical: 10, marginBottom: 15, marginHorizontal: 15, backgroundColor: selected ? "#4E8415" : '#F2F2F2' }} onPress={() => addSelectedComponent(symptom.value)}>
        <Image source={{ uri: symptom.icon }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <Text style={{ fontSize: 14, color: selected ? 'white' : 'gray' }}>{symptom.symptom}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 25,
        paddingRight: 15,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
    },
    itemQuantity: {
        fontSize: 14,
        color: 'gray',
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