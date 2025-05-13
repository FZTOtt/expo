import { Slot, Stack } from "expo-router";
import React from "react";
// import './globals.css';
import Navbar from "@/components/navbar";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import store from "@/redux/store";

export default function RootLayout() {
  return <ReduxProvider store={store}>
        <PaperProvider>
            <Slot />
        </PaperProvider>
    </ReduxProvider>
}
