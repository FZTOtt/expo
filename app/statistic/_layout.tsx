import { Stack } from 'expo-router';
import React from 'react';

export default function StatisticLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }}/>
            <Stack.Screen name="[tag]" options={{ headerShown: false }}/>
        </Stack>
    )
}