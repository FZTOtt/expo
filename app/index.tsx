import LeftBar from "@/components/leftBar";
import RightBar from "@/components/rightBar";
import WordPage from "@/components/wordPage";
import { View, StyleSheet } from "react-native";

export default function Index() {

    return (
        <View style={styles.container}>
            <LeftBar />
            <WordPage />
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