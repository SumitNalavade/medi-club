import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Sign In',
                }}
            />
            <Stack.Screen
                name="signup"
                options={{
                    presentation: "modal",
                    title: 'Sign Up',
                }}
            />
        </Stack>
    );
}
