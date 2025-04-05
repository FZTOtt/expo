import { Stack } from "expo-router";
import './globals.css';
import Navbar from "@/components/navbar";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function RootLayout() {
  return <Provider store={store}>
        <Stack 
        screenOptions={{
            header: () => <Navbar />,
        }}
        >
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
      </Stack>
    </Provider>
}
