import { Stack, Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    // <Stack>
    //   <Stack.Screen name="index" options={{ headerShown: false }} />
    //   <Stack.Screen name="statistic" options={{ headerShown: false }} />
    // </Stack>
    // <Tabs 
    //     screenOptions={{
    //         headerShown: false,
    //     }}
    // />
    <Stack
      screenOptions={{
        headerShown: false, // Убирает верхний навбар
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="statistic" />
      {/* Другие экраны */}
    </Stack>
  );
}