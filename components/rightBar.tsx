import { StyleSheet, View } from "react-native"
import Modules from "./modules";
import Reference from "./reference";

const RightBar = () => {



    return (
        <View style={styles.container}>
            <Modules/>
            {/* <Reference/> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: 400
    },
    modules: {
        borderColor: 'rgba(82, 101, 109, 1)',
        borderBottomWidth: 2,
        height: '50%'
    }
})

export default RightBar;