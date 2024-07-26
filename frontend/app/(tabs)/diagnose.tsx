import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ConditionItem } from '@/components/ConditionComponent';
import axios from 'axios';

import itchingIcon from "../../assets/images/itchingIcon.png";

const symptoms = {
    skinConditions: [
        { id: "1", symptom: "Itching", icon: itchingIcon, value: 'itching' },
        { id: "2", symptom: "Skin rash", icon: itchingIcon, value: 'skin_rash' },
        { id: "3", symptom: "Nodal skin eruptions", icon: itchingIcon, value: "nodal_skin_eruptions" },
        { id: "4", symptom: "Ulcers on tongue", icon: itchingIcon, value: "ulcers_on_tongue" },
        { id: "5", symptom: "Muscle wasting", icon: itchingIcon, value: "muscle_wasting" },
        { id: "6", symptom: "Blisters", icon: itchingIcon, value: 'blister' },
        { id: "7", symptom: "Skin peeling", icon: itchingIcon, value: 'skin_peeling' },
        { id: "8", symptom: "Silver-like dusting", icon: itchingIcon, value: 'silver_like_dusting' },
        { id: "9", symptom: "Small dents in nails", icon: itchingIcon, value: 'small_dents_in_nails' },
        { id: "10", symptom: "Inflammatory nails", icon: itchingIcon, value: 'inflammatory_nails' },
        { id: "11", symptom: "Blackheads", icon: itchingIcon, value: 'blackheads' },
        { id: "12", symptom: "Scurring", icon: itchingIcon, value: 'scurring' },
        { id: "13", symptom: "Red sore around nose", icon: itchingIcon, value: 'red_sore_around_nose' },
        { id: "14", symptom: "Yellow crust ooze", icon: itchingIcon, value: 'yellow_crust_ooze' }
    ],
    respiratorySymptoms: [
        { id: "1", symptom: "Continuous sneezing", icon: itchingIcon, value: 'continuous_sneezing' },
        { id: "2", symptom: "Cough", icon: itchingIcon, value: 'cough' },
        { id: "3", symptom: "Breathlessness", icon: itchingIcon, value: "breathlessness" },
        { id: "4", symptom: "Phlegm", icon: itchingIcon, value: "phlegm" },
        { id: "5", symptom: "Runny nose", icon: itchingIcon, value: "runny_nose" },
        { id: "6", symptom: "Congestion", icon: itchingIcon, value: 'congestion' },
        { id: "7", symptom: "Chest pain", icon: itchingIcon, value: 'chest_pain' },
    ]
}

const DiagnoseScreen = () => {
    const router = useRouter();
    
    const [currentGroup, setCurrentGroup] = useState('skinConditions');
    const [selectedSymptoms, setSelectedSymptoms] = useState<any[]>([]);

    const addSelectedSymptom = (symptom: string) => {
        setSelectedSymptoms([...selectedSymptoms, symptom]);
    }

    const handleDiagnose = async () => {
        try {
            // Replace with your API endpoint
            const response = await axios.post('http://localhost:3004/predict', {
                symptoms: [...selectedSymptoms],
            });

            router.push({ pathname: '/info', params: { diagnosis: response.data.disease } })
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    }

    const renderFlatList = (data: any[]) => (
        <FlatList
            data={data}
            style={styles.flatList}
            renderItem={({ item }) => (
                <ConditionItem
                    symptom={item}
                    selected={selectedSymptoms.includes(item.value)}
                    addSelectedComponent={addSelectedSymptom}
                />
            )}
            keyExtractor={(item) => item.id}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>
                {currentGroup === 'skinConditions' ? 'Skin Conditions' : 'Respiratory Symptoms'}
            </Text>
            {currentGroup === 'skinConditions'
                ? renderFlatList(symptoms.skinConditions)
                : renderFlatList(symptoms.respiratorySymptoms)}
            {currentGroup === 'respiratorySymptoms' ? (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleDiagnose}
                >
                    <Text style={styles.addButtonText}>Diagnose</Text>
                </TouchableOpacity>
            ) : (<TouchableOpacity
                style={styles.addButton}
                onPress={() => setCurrentGroup(currentGroup === 'skinConditions' ? 'respiratorySymptoms' : 'skinConditions')}
            >
                <Text style={styles.addButtonText}>Next</Text>
            </TouchableOpacity>)}
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
        marginBottom: 20
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    flatList: {
        marginTop: 20,
    },
});

export default DiagnoseScreen;
