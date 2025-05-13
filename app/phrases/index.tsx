// import 'react-native-gesture-handler'

import ExercisePhrasesBlock from "@/components/exercisePhrasesBlock";
import LeftBar from "@/components/leftBar";
import RightBar from "@/components/rightBar";
import { View, StyleSheet } from "react-native";

const Phrases = () => {
    return (
        <View style={styles.container}>
            <LeftBar />
            <ExercisePhrasesBlock />
            <RightBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(19, 31, 36, 1)',
        flexDirection: 'row'
    },
});

export default Phrases;