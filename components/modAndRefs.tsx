import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import Modules from "./modules";
import Reference from "./reference";
import { useWindowDimensions } from 'react-native';

const ModAndRefs = () => {

    const { width } = useWindowDimensions();

    if (width < 1200) {
        return (
            <TouchableOpacity style={styles.refButton}>
                <Text style={styles.refText}>
                    Справка
                </Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <Modules/>
            <Reference/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: 400,
        minWidth: 250
    },
    modules: {
        borderColor: 'rgba(82, 101, 109, 1)',
        borderBottomWidth: 2,
        height: '50%'
    },
    refButton: {
        position: 'absolute',
        top: 20,
        right: 20
    },
    refText: {
        fontSize: 20,
        color: 'white'
    }
})

export default ModAndRefs;