import Manage from "@/components/manage";
import ReferenceModal from "@/components/referenceModal";
import StatusBar from "@/components/statusBar";
import TagFilter from "@/components/tagFilter";
import Target from "@/components/target";
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
        <View style={[styles.container, { paddingTop }]}>
            {tags && <StatusBar style={styles.status}/>}
            <TagFilter/>
            <Target />
            <Manage />
            <ReferenceModal />
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
    status: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '20%',
        minWidth: 200,
        borderRadius: 7
    },
});