import { Stack } from 'expo-router';
import React from 'react';

export default function ThemesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }}/>
        </Stack>
    )
}