import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const Info = () => {
    const params = useLocalSearchParams();
    const { diagnosis } = params;
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDiagnosisInfo = async () => {
            try {
                setLoading(true);
                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'user',
                            content: `Provide more information about the diagnosis: ${diagnosis}`
                        }
                    ]
                }, {
                    headers: {
                        'Authorization': `Bearer `, // Replace with your actual API key
                        'Content-Type': 'application/json'
                    }
                });

                setInfo(response.data.choices[0].message.content);
            } catch (err) {
                setError('Failed to fetch information. Please try again later.');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiagnosisInfo();
    }, [diagnosis]);

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#4E8415" />
                </View>
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <>
                    <Text style={styles.header}>{diagnosis}</Text>
                    <Text style={styles.info}>{info}</Text>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        height: '100%',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 45,
        marginLeft: 20,
    },
    info: {
        fontSize: 16,
        marginTop: 10,
        marginLeft: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        marginTop: 20,
        marginLeft: 20,
    },
});

export default Info;
