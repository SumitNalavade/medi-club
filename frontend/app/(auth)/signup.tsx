import React, { useState } from 'react';
import { StyleSheet, View, Image, TextInput, TouchableOpacity, SafeAreaView, Text, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await fetch('http://localhost:3456/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            // if (data.success) {
            Alert.alert('Success', 'Signup successful!');
            router.replace("/home")
            // } else {
            //     Alert.alert('Signup failed');
            // }
        } catch (error) {
            Alert.alert('Error', 'An error occurred during signup');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.signupLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 400,  // Adjust as needed
        height: 150,  // Adjust as needed
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4E8415',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signupText: {
        color: '#333',
    },
    signupLink: {
        color: '#2196F3',
        fontWeight: 'bold',
        textDecorationLine: "underline"
    },
});