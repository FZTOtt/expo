import Manage from "@/components/manage";
import TagFilter from "@/components/tagFilter";
import Target from "@/components/target";
import { useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";

export default function Index() {

  useEffect(() => {
    console.log('MOUNTED Component index');
    return () => console.log('UNMOUNTED Component index');
    }, []);

  const { height } = Dimensions.get('window');
  const paddingTop = height * 0.2;
  
  return (
    <View style={[styles.container, { paddingTop }]}>
      <TagFilter/>
      <Target />
      <Manage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 300,
    backgroundColor: '#fff',
    position: 'relative'
  },
});