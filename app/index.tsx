import LeftBar from "@/components/leftBar";
import Manage from "@/components/manage";
import OnboardRequest from "@/components/onboardRequest";
import ReferenceModal from "@/components/referenceModal";
import StatusBar from "@/components/statusBar";
import TagFilter from "@/components/tagFilter";
import Target from "@/components/target";
import WordPage from "@/components/wordPage";
import { useAppSelector } from "@/hooks";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

export default function Index() {

    const { tags } = useAppSelector((state: RootState) => state.translated)

    useEffect(() => {
    console.log('MOUNTED Component index');
    return () => console.log('UNMOUNTED Component index');
    }, []);

    const { height } = Dimensions.get('window');
    const paddingTop = height * 0.2;

    return (
        <View style={styles.container}>
            <LeftBar />
            <WordPage />
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