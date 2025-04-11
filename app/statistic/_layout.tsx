import { Stack } from 'expo-router';
import React from 'react';

export default function StatisticLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="[tag]" />
        </Stack>
    )
}