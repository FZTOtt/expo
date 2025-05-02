import LeftBar from "@/components/leftBar";
import RightBar from "@/components/rightBar";
import { View, StyleSheet } from "react-native";
import ExerciseWordBlock from "@/components/exerciseWordBlock";

export default function Index() {

    return (
        <View style={styles.container}>
            <LeftBar />
            <ExerciseWordBlock/>
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