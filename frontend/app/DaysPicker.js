import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DaysPicker = ({ selectedDays, setSelectedDays }) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    return (
        <View style={styles.container}>
            {daysOfWeek.map(day => (
                <TouchableOpacity
                    key={day}
                    style={selectedDays.includes(day) ? styles.dayButtonSelected : styles.dayButton}
                    onPress={() => toggleDay(day)}
                >
                    <Text style={styles.dayText}>{day}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    dayButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#FFF',
        alignItems: 'center',
        marginBottom: 10,
        width: '30%',
    },
    dayButtonSelected: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#006940',
        backgroundColor: '#E5F9E7',
        alignItems: 'center',
        marginBottom: 10,
        width: '30%',
    },
    dayText: {
        fontSize: 16,
        color: '#333',
    },
});

export default DaysPicker;
